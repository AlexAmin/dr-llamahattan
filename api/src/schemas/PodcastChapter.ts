import {z} from 'zod';

export const PodcastChapterSchema = z.object({
    index: z.number().describe("Index of the chapter"),
    title: z.string().describe("Title of the chapter"),
    description: z.string().describe("Detailed bullet points of what should be discussed in this chapter"),
})
export const PodcastChapterGenerationSchema = z.object({
    thoughts: z.array(z.string()).describe("Your thought process before you start writing chapters"),
    chapters: z.array(PodcastChapterSchema)
})
export type PodcastChapter = z.infer<typeof PodcastChapterSchema>;