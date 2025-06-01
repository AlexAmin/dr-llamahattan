import {llamaClient} from "../llama/llamaClient";
import {loadTextFile} from "../util/loadTextFile";
import {toLLMSchema} from "../llama/toLLMSchema";
import {TopicSchema} from "../schemas/Checklist";
import {Person, PersonSchema} from "../schemas/Person";
import {MessageTextContentItem} from "llama-api-client/src/resources/chat/chat";

const prompt: string = loadTextFile("PersonQuestionPrompt.md")

export async function promptPersonQuestion(topic: string, person?: Person) {
    const personSchema = JSON.stringify(toLLMSchema(PersonSchema))
    const checklistSchema = toLLMSchema(TopicSchema)
    const injectedPrompt = structuredClone(prompt)
        .replace("{{TOPIC}}", topic)
        .replace("{{SCHEMA}}", personSchema)
    const createChatCompletionResponse = await llamaClient.chat.completions.create({
        messages: [
            {role: "system", content: injectedPrompt},
            {role: "user", content: JSON.stringify(person || {})}
        ],
        response_format: {
            type: "text"
        },
        model: "Llama-4-Scout-17B-16E-Instruct-FP8",
    });
    return (createChatCompletionResponse.completion_message.content as MessageTextContentItem).text
}

if (require.main === module) {
    promptPersonQuestion("education")
        .then((result) => console.log(result))
}