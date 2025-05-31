import {z} from 'zod';

export const ChecklistSchema = z.object({
    path: z.string().describe("path within the Person schema as dot notation"),
    missing: z.boolean().describe("Can the property at this value be filled with the data provided by the user?"),
    question: z.string().describe("A direct question to the user to provide more data. Example: \"Tell me more about your job at the supermarket\", \"Tell me about your father\", etc."),
});

export type Checklist = z.infer<typeof ChecklistSchema>;