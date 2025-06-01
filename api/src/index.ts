import {serve} from "@hono/node-server";
import {Context, Hono} from "hono";
import {type Firestore, getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {cors} from "hono/cors";
import {FirebaseOptions} from "@firebase/app";
import {transcribe} from "./transcribe/transcribe";
import {ImplicitArrayBuffer} from "node:buffer";
import {promptTopic} from "./prompting/promptTopic";
import {promptPerson} from "./prompting/promptPerson";
import {usePersonService} from "./services/person";
import {useTranscriptionsService} from "./services/transcriptions";
import {Person} from "./schemas/Person";
import {PodcastsRouter} from "./routes/podcastsRouter";
import {Checklist} from "./schemas/Checklist";
import {calculateTopicScore} from "./util/calculateTopicScore";
import {promptPersonQuestion} from "./prompting/promptPersonQuestion";

// Initialize Firebase
const firebaseConfig: FirebaseOptions = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
}
const firebaseApp = initializeApp(firebaseConfig)
const db: Firestore = getFirestore(firebaseApp);
const defaultUserId: string = "test"

// Initialize Hono
const app = new Hono<{ Variables: { db: Firestore } }>();
app.use(cors({
    origin: "http://localhost:5173",
    allowHeaders: ["*"],
    allowMethods: ["*"],
    exposeHeaders: []
}));

app.use("*", async (c: Context, next) => {
    c.set("firebaseApp", firebaseApp);
    c.set("db", db);
    c.set("userId", defaultUserId)
    await next();
});
app.route("/podcasts", PodcastsRouter)

app.post("/prompt/live", async (c, next) => {
    const formData = await c.req.formData();
    const audioFile = formData.get("file");
    const previousTopic = formData.get("topic") as string | null
    const previousScore: number = Number.parseFloat(formData.get("score") || 0)
    const checklist: Checklist[] | null = formData.has("checklist") ? JSON.parse(formData.get("checklist") as string) as Checklist[] | null : null

    if (!audioFile || !(audioFile instanceof File)) {
        return c.text("Missing or invalid audio file", 400);
    }

    const audioBuffer: Buffer<ImplicitArrayBuffer<ArrayBuffer>> = Buffer.from(await audioFile.arrayBuffer());
    let [person, transcription]: [Person | undefined, string | undefined] = await Promise.all([
        usePersonService(db).getPerson(defaultUserId),
        transcribe(audioBuffer)
    ])
    if (!person) person = {}

    if (!transcription) return c.json({}, 500)
    const topic: string = await promptTopic(transcription)
    if (topic === previousTopic) {
        const topicScore: number = calculateTopicScore(person, topic)
        if (previousScore < topicScore) {
            const question = await promptPersonQuestion(topic, person)
        }
    }
    if (!person && !previousTopic)
        for (const key in Object.keys(person || {})) {
            if (topic === "other") {
                person[key]
            }
        }
    if (topic === "other") {
    }

    return c.json(topic)
})

app.post("/prompt", async (c, next) => {
    const formData = await c.req.formData();
    const audioFile = formData.get("file");
    if (!audioFile || !(audioFile instanceof File)) {
        return c.text('Missing or invalid audio file', 400);
    }
    const audioBuffer: Buffer<ImplicitArrayBuffer<ArrayBuffer>> = Buffer.from(await audioFile.arrayBuffer());
    const [person, transcription] = await Promise.all([
        usePersonService(db).getPerson(defaultUserId),
        transcribe(audioBuffer)
    ])
    if (!transcription) return c.json({}, 500)
    // noinspection ES6MissingAwait - no need to wait
    useTranscriptionsService(db).addTranscription(transcription, defaultUserId)
    const result: Person = await promptPerson(transcription, person)
    usePersonService(db).setPerson(defaultUserId, result)
    return c.json(result)
})

const port = process.env.PORT || 3000;
serve({
    fetch: app.fetch,
    port: Number(port)
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
