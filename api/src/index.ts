import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {type Firestore, getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {cors} from "hono/cors";
import {FirebaseOptions} from "@firebase/app";
import {transcribe} from "./transcribe/transcribe";
import {ImplicitArrayBuffer} from "node:buffer";
import fs from "fs";
import {promptChecklist} from "./prompting/promptChecklist";
import {promptPerson} from "./prompting/promptPerson";

// Initialize Firebase
const firebaseConfig: FirebaseOptions = {projectId: process.env.FIREBASE_PROJECT_ID}
const firebaseApp = initializeApp(firebaseConfig)
const db: Firestore = getFirestore(firebaseApp);

// Initialize Hono
const app = new Hono<{ Variables: { db: Firestore } }>();
app.use(cors({
    origin: "http://localhost:5173",
    allowHeaders: ["*"],
    allowMethods: ["*"],
    exposeHeaders: []
}));

app.use("*", async (c, next) => {
    c.set("db", db);
    await next();
});

app.post("/prompt/live", async (c, next) => {
    const formData = await c.req.formData();
    const audioFile = formData.get("file");
    if (!audioFile || !(audioFile instanceof File)) {
        return c.text("Missing or invalid audio file", 400);
    }
    const audioBuffer: Buffer<ImplicitArrayBuffer<ArrayBuffer>> = Buffer.from(await audioFile.arrayBuffer());
    const transcription = await transcribe(audioBuffer)
    const result = await promptChecklist(transcription)
    return c.json(result)
})

app.post("/prompt", async(c, next)=>{
    const formData = await c.req.formData();
    const audioFile = formData.get("file");
    if (!audioFile || !(audioFile instanceof File)) {
        return c.text('Missing or invalid audio file', 400);
    }
    const audioBuffer: Buffer<ImplicitArrayBuffer<ArrayBuffer>> = Buffer.from(await audioFile.arrayBuffer());
    const transcription = await transcribe(audioBuffer)
    const result = await promptPerson(transcription)
    return c.json(result)
})

const port = process.env.PORT || 3000;
serve({
    fetch: app.fetch,
    port: Number(port)
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});