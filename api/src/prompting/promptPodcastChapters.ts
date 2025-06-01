import {llamaClient} from "../llama/llamaClient";
import {loadTextFile} from "../util/loadTextFile";
import {Person} from "../schemas/Person";
import {toLLMSchema} from "../llama/toLLMSchema";
import {PodcastChapterGenerationSchema, PodcastChapterSchema} from "../schemas/PodcastChapter";
import {SAMPLE_USER} from "../demo/sampleUserData";
import {MessageTextContentItem} from "llama-api-client/src/resources/chat/chat";

const prompt: string = loadTextFile("PodcastChapterPrompt.md")

export async function promptPodcastChapters(topic: string, durationMinutes: number, person: Person) {
    const injectedPrompt = structuredClone(prompt)
        .replace("{{PODCAST_TOPIC}}", topic)
        .replace("{{PODCAST_DURATION}}", "" + durationMinutes)
        .replace("{{PERSON}}", JSON.stringify(person))
    const llmSchema = toLLMSchema(PodcastChapterGenerationSchema)
    const createChatCompletionResponse = await llamaClient.chat.completions.create({
        messages: [
            {role: "system", content: injectedPrompt},
            {role: "user", content: "Please come up with some chapters for the new episode about me"}
        ],
        temperature: 0.5,
        response_format: {
            type: "json_schema",
            // @ts-expect-error
            json_schema: {schema: llmSchema}
        },
            model: "Llama-4-Scout-17B-16E-Instruct-FP8",
    });
    const data = JSON.parse((createChatCompletionResponse.completion_message.content as MessageTextContentItem).text)
    return data.chapters
}

if (require.main === module) {
    promptPodcastChapters(
        "The person's family",
        10,
        SAMPLE_USER as Person
    ).then((result) => console.log("result", result))
}
