import {llamaClient} from "../llama/llamaClient";
import {loadTextFile} from "../util/loadTextFile";
import {Person} from "../schemas/Person";
import {PodcastText, PodcastTextGenerationSchema} from "../schemas/PodcastText";
import {toLLMSchema} from "../llama/toLLMSchema";
import {PodcastChapter} from "../schemas/PodcastChapter";
import {SAMPLE_USER} from "../demo/sampleUserData";
import {SAMPLE_CHAPTERS} from "../demo/sampleChapterData";
import {MessageTextContentItem} from "llama-api-client/src/resources/chat/chat";

const prompt: string = loadTextFile("PodcastPrompt.md")

export async function promptPodcast(topic: string, durationMinutes: number, person: Person, chapter: PodcastChapter, chapterIndex: number, chapterCount: number): Promise<PodcastText[]> {
    const injectedPrompt = structuredClone(prompt)
        .replace("{{PODCAST_TOPIC}}", topic)
        .replace("{{PODCAST_DURATION}}", "" + durationMinutes)
        .replace("{{CHAPTER}}", JSON.stringify(chapter))
        .replace("{{CHAPTER_INDEX}}", (chapterIndex + 1).toString())
        .replace("{{CHAPTER_COUNT}}", chapterCount.toString())
        .replace("{{PERSON}}", JSON.stringify(person))
    const llmSchema = toLLMSchema(PodcastTextGenerationSchema)
    const createChatCompletionResponse = await llamaClient.chat.completions.create({
        messages: [
            {role: "system", content: injectedPrompt},
            {role: "user", content: "Please write the text"}
        ],
        temperature: 0.5,
        max_completion_tokens: 9999999,
        response_format: {
            type: "json_schema",
            // @ts-expect-error
            json_schema: {schema: llmSchema}
        },
        model: "Llama-4-Maverick-17B-128E-Instruct-FP8",
    });
    const data = JSON.parse((createChatCompletionResponse.completion_message.content as MessageTextContentItem).text)
    return data.podcast
}

if (require.main === module) {
    const index = 1
    promptPodcast(
        "The person's family",
        10,
        SAMPLE_USER as Person,
        SAMPLE_CHAPTERS[index],
        index,
        SAMPLE_CHAPTERS.length
    ).then((result) => console.log("result", result))
}
