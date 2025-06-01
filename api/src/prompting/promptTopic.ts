import {llamaClient} from "../llama/llamaClient";
import {loadTextFile} from "../util/loadTextFile";
import {toLLMSchema} from "../llama/toLLMSchema";
import {TopicSchema} from "../schemas/Checklist";
import {PersonSchema} from "../schemas/Person";
import {MessageTextContentItem} from "llama-api-client/src/resources/chat/chat";

const prompt: string = loadTextFile("TopicPrompt.md")

export async function promptTopic(transcription: string) {
    const personSchema = JSON.stringify(toLLMSchema(PersonSchema))
    const topicSchema = toLLMSchema(TopicSchema)
    const injectedPrompt = structuredClone(prompt)
        .replace("{{SCHEMA}}", personSchema)
    const createChatCompletionResponse = await llamaClient.chat.completions.create({
        messages: [
            {role: "system", content: injectedPrompt},
            {role: "user", content: transcription}
        ],
        response_format: {
            type: "json_schema",
            // @ts-expect-error - schema error on metas side
            json_schema: {schema: topicSchema}
        },
        model: "Llama-4-Scout-17B-16E-Instruct-FP8",
    });
    return JSON.parse((createChatCompletionResponse.completion_message.content as MessageTextContentItem).text).topic
}

if (require.main === module) {
}