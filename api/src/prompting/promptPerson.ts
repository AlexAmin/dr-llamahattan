import {llamaClient} from "../llama/llamaClient";
import {loadTextFile} from "../util/loadTextFile";
import {
    AssetsSchema,
    AttributesSchema,
    EducationsSchema,
    EmploymentsSchema,
    EventsSchema,
    Person,
    PersonalInformationSchema,
    PersonRelationshipsSchema,
    PhysicalCharacteristicsSchema,
    ResidencesSchema
} from "../schemas/Person";
import {toLLMSchema} from "../llama/toLLMSchema";
import {MessageTextContentItem} from "llama-api-client/src/resources/chat/chat";
import {Topic} from "../schemas/Checklist";

const promptString: string = loadTextFile("PersonPrompt.md")

const promptPersonalInformationSchema = async (transcript: string, data: Person) => data.personalInformation = await prompt(PersonalInformationSchema, transcript, data)
const promptAttributesSchema = async (transcript: string, data: Person) => data.attributes = await prompt(AttributesSchema, transcript, data)
const promptPhysicalCharacteristicsSchema = async (transcript: string, data: Person) => data.physicalCharacteristics = await prompt(PhysicalCharacteristicsSchema, transcript, data)
const promptPersonRelationshipsSchema = async (transcript: string, data: Person) => data.relationships = await prompt(PersonRelationshipsSchema, transcript, data)
const promptEducationsSchema = async (transcript: string, data: Person) => data.education = await prompt(EducationsSchema, transcript, data)
const promptEmploymentsSchema = async (transcript: string, data: Person) => data.employment = await prompt(EmploymentsSchema, transcript, data)
const promptResidencesSchema = async (transcript: string, data: Person) => data.residences = await prompt(ResidencesSchema, transcript, data)
const promptAssetsSchema = async (transcript: string, data: Person) => data.assets = await prompt(AssetsSchema, transcript, data)
const promptEventsSchema = async (transcript: string, data: Person) => data.events = await prompt(EventsSchema, transcript, data)

export async function promptPerson(transcription: string, person?: Person): Promise<Person> {
    const data: Person = structuredClone(person || {} as unknown as Person)
    console.log("Prompting person")
    await Promise.all([
        promptPersonRelationshipsSchema(transcription, data),
        promptPersonalInformationSchema(transcription, data),
        promptAttributesSchema(transcription, data),
        promptPhysicalCharacteristicsSchema(transcription, data),
        promptEducationsSchema(transcription, data),
        promptEmploymentsSchema(transcription, data),
        promptResidencesSchema(transcription, data),
        promptAssetsSchema(transcription, data),
        promptEventsSchema(transcription, data)
    ])
    console.log("Prompted person")
    return data
}

export async function promptPersonTopic(transcription: string, topic: Topic, person?: Person): Promise<Person> {
    const data: Person = structuredClone(person || {} as unknown as Person)
    console.log("Prompting person for topic", topic)
    if (topic === Topic.PersonalInformation) await promptPersonalInformationSchema(transcription, data)
    if (topic === Topic.Attributes) await promptAttributesSchema(transcription, data)
    if (topic === Topic.PhysicalCharacteristics) await promptPhysicalCharacteristicsSchema(transcription, data)
    if (topic === Topic.Relationships) await promptPersonRelationshipsSchema(transcription, data)
    if (topic === Topic.Education) await promptEducationsSchema(transcription, data)
    if (topic === Topic.Employment) await promptEmploymentsSchema(transcription, data)
    if (topic === Topic.Residences) await promptResidencesSchema(transcription, data)
    if (topic === Topic.Assets) await promptAssetsSchema(transcription, data)
    if (topic === Topic.Events) await promptEventsSchema(transcription, data)
    if (topic === Topic.Other) return data
    console.log("Prompted person for topic", topic)
    return data
}

async function prompt(schema: any, transcript: string, data?: Person) {
    const llmSchema = toLLMSchema(schema)
    const injectedPrompt = structuredClone(promptString)
        .replace("{{PERSON}}", data ? JSON.stringify(data) : "")

    const createChatCompletionResponse = await llamaClient.chat.completions.create({
        max_completion_tokens: 16000,
        temperature: 0.1,
        stream: false,
        messages: [
            {role: "system", content: injectedPrompt},
            {role: "user", content: transcript}
        ],
        response_format: {
            type: "json_schema",
            // @ts-expect-error - invalid schema def by meta
            json_schema: {schema: llmSchema}
        },
        model: "Cerebras-Llama-4-Maverick-17B-128E-Instruct",
    });
    let result = JSON.parse((createChatCompletionResponse.completion_message.content as MessageTextContentItem).text)
    if (result.data) result = result.data
    return result
}

if (require.main === module) {
    promptPerson("I'm Alex, and I grew up in a small town in Vermont. It was just me, my older sister, and our parents. We lived in an old farmhouse with a big yard, and I spent most of my childhood exploring the woods behind our house. My dad was a carpenter, and my mom was a teacher, so we always had a lot of projects going on around the house. Weekends were often spent helping Dad in his workshop or tagging along with Mom to the local library.\n" +
        "\n" +
        "My sister, Sarah, was a few years older, and we were always getting into something, whether it was building treehouses or staging elaborate plays for our parents. Our family vacations were usually camping trips to the Adirondacks, where we'd hike and swim and sit around a campfire telling stories. It was a simple life, but a good one, full of fresh air, close-knit community, and the kind of quiet that lets you hear your own thoughts. That upbringing really shaped who I am today.")
        .then((result) => console.log("done", result))
}
