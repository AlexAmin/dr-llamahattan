import {Context, Hono} from "hono";
import {usePersonService} from "../services/person";
import {Person} from "../schemas/Person";
import {ImplicitArrayBuffer} from "node:buffer";
import fs from "fs";
import {transcribe} from "../transcribe/transcribe";
import {promptTopic} from "../prompting/promptTopic";
import {promptPerson, promptPersonTopic} from "../prompting/promptPerson";
import {Topic} from "../schemas/Checklist";
import {calculateTopicScore} from "../util/calculateTopicScore";
import {promptPersonQuestion} from "../prompting/promptPersonQuestion";
import {useTranscriptionsService} from "../services/transcriptions"
import {useQuestionService} from "../services/questionService";

export const PromptRouter = new Hono()

PromptRouter.post("/live", async (c: Context, next) => {
    const db = c.get("db")
    const userId = c.get("userId")
    const formData = await c.req.formData();
    const audioFile = formData.get("file");
    const previousTopic = formData.get("topic") as string | null
    const previousScore: number = Number.parseFloat((formData.get("score") as string | null) || "0")

    if (!audioFile || !(audioFile instanceof File)) {
        return c.text("Missing or invalid audio file", 400);
    }

    const audioBuffer: Buffer<ImplicitArrayBuffer<ArrayBuffer>> = Buffer.from(await audioFile.arrayBuffer());
    fs.writeFileSync("file.wav", audioBuffer)

    let [person, transcription]: [Person | undefined, string | undefined] = await Promise.all([
        usePersonService(db).getPerson(userId),
        transcribe(audioBuffer)
    ])
    // @ts-ignore
    if (!person) person = {}

    console.log({transcription})
    if (!transcription) return c.json({}, 500)
    const topic: string = await promptTopic(transcription)
    person = await promptPersonTopic(transcription, topic as Topic, person)
    const topicScore: number = calculateTopicScore(person as Person, topic as Topic)
    if (topic !== previousTopic) {
        // Topic has changed, ask new question
        const question = await promptPersonQuestion(topic, person)
        useQuestionService(db).setQuestion(userId, question)
        return c.json({question, topic, score: topicScore})
    }
    if (topicScore > 0.80) {
        // Sufficient information present, suggest new topic
        for (const topic of Object.values(Topic)) {
            const score = calculateTopicScore(person as Person, topic as Topic)
            if (score < 0.80) {
                const question = await promptPersonQuestion(topic, person)
                useQuestionService(db).setQuestion(userId, question)
                return c.json({question, topic, score: topicScore})
            }
        }
    }
    return c.json({topic, score: topicScore})
})

PromptRouter.post("/", async (c: Context, next) => {
    const db = c.get("db")
    const userId = c.get("userId")
    const formData = await c.req.formData();
    const audioFile = formData.get("file");
    if (!audioFile || !(audioFile instanceof File)) {
        return c.text('Missing or invalid audio file', 400);
    }
    const audioBuffer: Buffer<ImplicitArrayBuffer<ArrayBuffer>> = Buffer.from(await audioFile.arrayBuffer());
    const [person, transcription] = await Promise.all([
        usePersonService(db).getPerson(userId),
        transcribe(audioBuffer)
    ])
    if (!transcription) return c.json({}, 500)
    // noinspection ES6MissingAwait - no need to wait
    useTranscriptionsService(db).addTranscription(transcription, userId)
    const result: Person = await promptPerson(transcription, person)
    usePersonService(db).setPerson(userId, result)
    return c.json(result)
})

PromptRouter.get("/question", async (c: Context, next) => {
    const db = c.get("db")
    const userId = c.get("userId")
    const question = await useQuestionService(db).getQuestion(userId)
    return c.json({question})
})