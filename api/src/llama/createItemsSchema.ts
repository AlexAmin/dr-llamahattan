import {z} from "zod";

export function createItemsSchema<T extends z.ZodTypeAny>(itemSchema: T) {
    return z.object({
        data: z.array(itemSchema)
    });
}