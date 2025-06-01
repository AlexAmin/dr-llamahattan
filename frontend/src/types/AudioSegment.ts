
export interface AudioSegment {
    name: string;
    blob: Blob;
    url: string; // URL to the audio segment
    type: string; // MIME type of the audio segment
    duration: number; // Duration of the audio segment in seconds
}
