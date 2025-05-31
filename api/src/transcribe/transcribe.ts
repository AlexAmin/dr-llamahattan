import Groq, {toFile} from "groq-sdk";
import fs from "fs";

const client = new Groq({
    apiKey: process.env['GROQ_API_KEY'], // This is the default and can be omitted
});

export async function transcribe(data: Buffer): Promise<string | undefined> {
    const result: { text: string } | undefined = await client.audio.transcriptions.create({
        model: "whisper-large-v3-turbo",
        file: await toFile(data, new Date().getTime() + ".wav"),
    }).catch((e) => {
        console.warn("Transcription failed")
        return undefined
    })
    return result?.text
}

if (require.main === module) {
    const audioBuffer = fs.readFileSync('../../test.wav');
    transcribe(audioBuffer).then(console.log).catch(console.error);
}
