import {GenerateContentConfig, GoogleGenAI,} from '@google/genai';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {FirebaseApp, initializeApp} from 'firebase/app';
import {PodcastChapter} from "../schemas/PodcastChapter";
import mime from 'mime';
import {SAMPLE_CHAPTERS} from "../demo/sampleChapterData";
import {FirebaseOptions} from "@firebase/app";
import {loadTextFile} from "../util/loadTextFile";

const CoverImagePrompt = loadTextFile("CoverImagePrompt.md")
async function saveBinaryFile(fileName: string, content: Buffer, mimeType: string, app: FirebaseApp): Promise<string> {
    const storage = getStorage(app);
    const storageRef = ref(storage, `podcast-cover-images/${fileName}`);
    const metadata = {
        contentType: mimeType,
    };
    await uploadBytes(storageRef, content, metadata);
    return await getDownloadURL(storageRef);
}

export async function generateCoverImage(podcastId: string, chapters: PodcastChapter[], app: FirebaseApp) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const config: GenerateContentConfig = {
        responseModalities: ["IMAGE", "TEXT"],
        responseMimeType: "text/plain",
    };
    const model = 'gemini-2.0-flash-preview-image-generation';
    const contents = [
        {
            role: "user",
            parts: [
                {text: CoverImagePrompt}
            ]
        },
        {
            role: "user",
            parts: [
                {
                    text: "My podcast: "+ chapters.map((item) => `${item.description}`).join(". ")
                },
            ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });
    let fileIndex = 0;
    for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
            continue;
        }
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            const fileExtension = mime.getExtension(inlineData.mimeType || '');
            const buffer = Buffer.from(inlineData.data || '', 'base64');
            return saveBinaryFile(`${podcastId}.${fileExtension}`, buffer, inlineData.mimeType || '', app);
        }
    }
}


if (require.main === module) {
    const firebaseConfig: FirebaseOptions = {projectId: process.env.FIREBASE_PROJECT_ID, storageBucket: process.env.FIREBASE_STORAGE_BUCKET}
    const firebaseApp = initializeApp(firebaseConfig)
    generateCoverImage("test", SAMPLE_CHAPTERS, firebaseApp)
        .then((result) => console.log(result))
}
