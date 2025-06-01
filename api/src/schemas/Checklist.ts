import {z} from 'zod';


export enum Quality {
    good = "good",
    bad = "bad",
    missing = "missing",
}

export enum Topic {
    PersonalInformation = "personalInformation",
    Attributes = "attributes",
    PhysicalCharacteristics = "physicalCharacteristics",
    Relationships = "relationships",
    Education = "education",
    Employment = "employment",
    Residences = "residences",
    Assets = "assets",
    Events = "events",
    Other = "other"
}

export const TopicSchema = z.object({
    topic: z.nativeEnum(Topic).describe("What is the user currently talking about?")
});

export type Checklist = z.infer<typeof TopicSchema>;