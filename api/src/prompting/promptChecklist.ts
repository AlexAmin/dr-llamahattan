import {llamaClient} from "../llama/llamaClient";
import {loadTextFile} from "../util/loadTextFile";
import {toLLMSchema} from "../llama/toLLMSchema";
import {createItemsSchema} from "../llama/createItemsSchema";
import {ChecklistSchema} from "../schemas/Checklist";
import {PersonSchema} from "../schemas/Person";
import {promptPerson} from "./promptPerson";

const prompt: string = loadTextFile("ChecklistPrompt.md")

export async function promptChecklist(transcription: string) {
    const personSchema = JSON.stringify(toLLMSchema(PersonSchema))
    const checklistSchema = toLLMSchema(createItemsSchema(ChecklistSchema))
    const injectedPrompt = structuredClone(prompt).replace("{{SCHEMA}}", personSchema)
    const createChatCompletionResponse = await llamaClient.chat.completions.create({
        messages: [
            {role: "system", content: injectedPrompt},
            {role: "user", content: transcription}
        ],
        response_format: {
            type: "json_schema",
            json_schema: {schema: checklistSchema}
        },
        model: "Llama-4-Scout-17B-16E-Instruct-FP8",
    });
    return JSON.parse(createChatCompletionResponse.completion_message.content.text).data
}

if (require.main === module) {
    promptChecklist("I'm Alex, and I grew up in a small town in Vermont. It was just me, my older sister, and our parents. We lived in an old farmhouse with a big yard, and I spent most of my childhood exploring the woods behind our house. My dad was a carpenter, and my mom was a teacher, so we always had a lot of projects going on around the house. Weekends were often spent helping Dad in his workshop or tagging along with Mom to the local library.\n" +
        "\n" +
        "My sister, Sarah, was a few years older, and we were always getting into something, whether it was building treehouses or staging elaborate plays for our parents. Our family vacations were usually camping trips to the Adirondacks, where we'd hike and swim and sit around a campfire telling stories. It was a simple life, but a good one, full of fresh air, close-knit community, and the kind of quiet that lets you hear your own thoughts. That upbringing really shaped who I am today.")
        .then((result) => console.log("done", result))
}
