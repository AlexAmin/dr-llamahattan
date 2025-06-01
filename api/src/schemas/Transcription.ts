import {z} from 'zod';

export const TranscriptionSchema = z.object({
    transcription: z.string(),
    userId: z.string()
});

export type Transcription = z.infer<typeof TranscriptionSchema>;