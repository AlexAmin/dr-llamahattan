import {llamaClient} from "../llama/llamaClient";
import {loadTextFile} from "../util/loadTextFile";
import {PodcastText} from "../schemas/PodcastText";
import {MessageTextContentItem} from "llama-api-client/src/resources/chat/chat";

const prompt: string = loadTextFile("PodcastSummaryPrompt.md")

export async function promptPodcastSummary(podcast: PodcastText[]) {
    const injectedPrompt = structuredClone(prompt)
    const createChatCompletionResponse = await llamaClient.chat.completions.create({
        messages: [
            {role: "system", content: injectedPrompt},
            {role: "user", content: JSON.stringify(podcast)}
        ],
        response_format: {
            type: "text"
        },
            model: "Llama-4-Scout-17B-16E-Instruct-FP8",
    });
    return (createChatCompletionResponse.completion_message.content as MessageTextContentItem).text
}
