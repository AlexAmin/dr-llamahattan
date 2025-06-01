import {z} from 'zod';
import {PodcastTextSchema} from "./PodcastText";
import {PodcastChapterSchema} from "./PodcastChapter";

export const PodcastSchema = z.object({
    text: z.array(PodcastTextSchema),
    chapters: z.array(PodcastChapterSchema),
    summary: z.string(),
    duration: z.number(),
    topic: z.string(),
    userId: z.string(),
    createdAt: z.date(),
});

export type Podcast = z.infer<typeof PodcastSchema>;

