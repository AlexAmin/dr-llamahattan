import {z} from 'zod';

export const PodcastSummarySchema = z.object({
    id: z.string(),
    summary: z.string()
});

export type PodcastSummary = z.infer<typeof PodcastSummarySchema>;