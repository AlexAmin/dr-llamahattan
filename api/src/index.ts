import {serve} from "@hono/node-server";
import {Context, Hono} from "hono";
import {type Firestore, getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {cors} from "hono/cors";
import {FirebaseOptions} from "@firebase/app";
import {transcribe} from "./transcribe/transcribe";
import {ImplicitArrayBuffer} from "node:buffer";
import {promptTopic} from "./prompting/promptTopic";
import {promptPerson, promptPersonTopic} from "./prompting/promptPerson";
import {usePersonService} from "./services/person";
import {useTranscriptionsService} from "./services/transcriptions";
import {Person} from "./schemas/Person";
import {PodcastsRouter} from "./routes/podcastsRouter";
import {Topic} from "./schemas/Checklist";
import {calculateTopicScore} from "./util/calculateTopicScore";
import {promptPersonQuestion} from "./prompting/promptPersonQuestion";
import VAR from "webrtcvad"
import VAD from "webrtcvad";
import fs from "fs";
import {PromptRouter} from "./routes/promptRouter";
import { PersonRouter } from "./routes/personRouter";

interface VoiceSegment {
    startTime: number;
    endTime: number;
}

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
app.route("/prompt", PromptRouter)
app.route("/person", PersonRouter)



const port = process.env.PORT || 3000;
serve({
    fetch: app.fetch,
    port: Number(port)
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
