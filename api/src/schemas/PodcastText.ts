import {z} from 'zod';

export const PodcastTextSchema = z.object({
    type: z.enum(["directions", "text"]).describe("Directions are instructions for the crew, intro music, etc. Text is the actual text the person is supposed to speak."),
    speaker: z.string().describe("Who should speak this line (Examples: Host A, Host B, podcast subject, announcer, Speaker A, Speaker B, etc.)"),
    text: z.string().describe("The text the person is supposed to speak"),
})

export const PodcastTextGenerationSchema = z.object({
    thoughts: z.array(z.string()).describe("Your thought process before you start writing the podcast"),
    podcast: z.array(PodcastTextSchema).describe("Each item in the array is one line of text, one direction given by the director, etc.")
})

export type PodcastText = z.infer<typeof PodcastTextSchema>;