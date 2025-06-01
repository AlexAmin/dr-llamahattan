import {serve} from "@hono/node-server";
import {Context, Hono} from "hono";
import {type Firestore, getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";
import {cors} from "hono/cors";
import {FirebaseOptions} from "@firebase/app";
import {PodcastsRouter} from "./routes/podcastsRouter";
import {PromptRouter} from "./routes/promptRouter";
import {PersonRouter} from "./routes/personRouter";

interface VoiceSegment {
    startTime: number;
    endTime: number;
}

// Type for Hono context variables
type Variables = {
    db: Firestore;
    userId: string;
    firebaseApp: any;
}

// Initialize Firebase
const firebaseConfig: FirebaseOptions = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
}
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

app.use("*", async (c: Context, next) => {
    c.set("firebaseApp", firebaseApp);
    c.set("db", db);
    const userId = c.req.header("userId")
    c.set("userId", userId);
    await next();
});
app.route("/podcasts", PodcastsRouter)
app.route("/prompt", PromptRouter)
app.route("/persons", PersonRouter)


const port = process.env.PORT || 3000;
serve({
    fetch: app.fetch,
    port: Number(port)
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
