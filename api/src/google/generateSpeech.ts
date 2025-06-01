import {GoogleGenAI,} from '@google/genai';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {FirebaseApp, initializeApp} from 'firebase/app';
import {PodcastText} from "../schemas/PodcastText";
import mime from "mime";
import {FirebaseOptions} from "@firebase/app";
import * as fs from 'fs';

async function saveBinaryFile(fileName: string, content: Buffer, mimeType: string, app: FirebaseApp): Promise<string> {
    const storage = getStorage(app);
    const storageRef = ref(storage, `podcast-audio/${fileName}`);
    const metadata = {
        contentType: mimeType,
    };
    await uploadBytes(storageRef, content, metadata);
    return await getDownloadURL(storageRef);
}

export async function generateSpeech(podcastId: string, app: FirebaseApp, text: PodcastText[]) {
    const speakers: string[] = [...new Set(text.map((item) => item.speaker))]
    const voices = ["Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda"]
    let voiceConfigs = speakers.map((item, index) => {
        return {
            speaker: item,
            voiceConfig: {
                prebuiltVoiceConfig: {
                    voiceName: index > voices.length ? voices[0] : voices[index]
                }
            }
        }
    })
    if (voiceConfigs.length === 1) voiceConfigs.push({
        speaker: "Speaker 2",
        voiceConfig: {
            prebuiltVoiceConfig: {
                voiceName: voices[1]
            }
        }
    })
    else if (voiceConfigs.length > 2) voiceConfigs = voiceConfigs.slice(0, 2)
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
        temperature: 1,
        responseModalities: [
            'audio',
        ],
        speechConfig: {
            multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: voiceConfigs
            },
        },
    };
    const model = 'gemini-2.5-flash-preview-tts';
    console.log("Generating audio for", text.length, "texts")
    const contents = [{
        role: "user",
        parts:
            text.map((item) => {
                return {text: `${item.speaker}: ${item.text}`}
            })
    }]


    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });
    let fileIndex = 0;
    for await (const chunk of response) {
        console.log("audio chunk")
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
            continue;
        }
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const fileName = `ENTER_FILE_NAME_${fileIndex++}`;
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            let fileExtension = mime.getExtension(inlineData.mimeType || '');
            let buffer = Buffer.from(inlineData.data || '', 'base64');
            if (!fileExtension) {
                fileExtension = 'wav';
                buffer = convertToWav(inlineData.data || '', inlineData.mimeType || '');
            }
            return saveBinaryFile(podcastId + ".wav", buffer, "audio/wav", app);
        }
    }
    return undefined
}
interface WavConversionOptions {
    numChannels: number,
    sampleRate: number,
    bitsPerSample: number
}

function convertToWav(rawData: string, mimeType: string) {
    const options = parseMimeType(mimeType)
    const wavHeader = createWavHeader(rawData.length, options);
    const buffer = Buffer.from(rawData, 'base64');

    return Buffer.concat([wavHeader, buffer]);
}

function parseMimeType(mimeType: string) {
    const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
    const [_, format] = fileType.split('/');

    const options: Partial<WavConversionOptions> = {
        numChannels: 1,
    };

    if (format && format.startsWith('L')) {
        const bits = parseInt(format.slice(1), 10);
        if (!isNaN(bits)) {
            options.bitsPerSample = bits;
        }
    }

    for (const param of params) {
        const [key, value] = param.split('=').map(s => s.trim());
        if (key === 'rate') {
            options.sampleRate = parseInt(value, 10);
        }
    }

    return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
    const {
        numChannels,
        sampleRate,
        bitsPerSample,
    } = options;

    // http://soundfile.sapp.org/doc/WaveFormat

    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const buffer = Buffer.alloc(44);

    buffer.write('RIFF', 0);                      // ChunkID
    buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
    buffer.write('WAVE', 8);                      // Format
    buffer.write('fmt ', 12);                     // Subchunk1ID
    buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
    buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
    buffer.writeUInt16LE(numChannels, 22);        // NumChannels
    buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
    buffer.writeUInt32LE(byteRate, 28);           // ByteRate
    buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
    buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSampleq
    buffer.write('data', 36);                     // Subchunk2ID
    buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

    return buffer;
}

if (require.main === module) {
    const firebaseConfig: FirebaseOptions = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    }
    const firebaseApp = initializeApp(firebaseConfig)
    generateSpeech("test", firebaseApp, [{
        type: "text",
        speaker: "Host A",
        text: "Hello and welcome"
    }] as PodcastText[])
        .then((result) => console.log(result))
}
