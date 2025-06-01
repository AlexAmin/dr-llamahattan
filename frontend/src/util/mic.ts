export async function recordFromMic(callback: (data: Float32Array) => void): Promise<MediaRecorder> {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true})
        const mediaRecorder = new MediaRecorder(stream, {audioBitsPerSecond: 48000, mimeType: 'audio/webm;codecs=pcm'})
        const audioChunks: Blob[] = []

        async function send() {
            const blob = new Blob(audioChunks, {type: 'audio/wav'})
            const arrayBuffer = await blob.arrayBuffer();
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const float32Array = audioBuffer.getChannelData(0);
            console.log("length", float32Array.length)
            callback(float32Array);
        }

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data)
            send()
        }

        mediaRecorder.onstop = async () => {
            send()
        }

        mediaRecorder.start(250)
        console.log("mic started")
        return mediaRecorder
    } catch (error) {
        console.error("Error accessing microphone:", error)
        throw new Error("mic access failed")
    }
}