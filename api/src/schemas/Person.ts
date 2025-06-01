import {z} from 'zod';

// Reusable Schemas
const DateStringSchema = z.string()

const PeriodSchema = z.object({
    startDate: DateStringSchema,
    endDate: DateStringSchema.describe("End date can be null for current events"),
});

export const PersonRelationshipSchema = z.object({
    name: z.string().describe("Name of the other person in this relationship"),
    type: z.enum(['Parent', 'Child', 'Spouse', 'Partner', 'Sibling', 'Friend', 'Professional', 'Other']),
    details: z.string().describe("Long text detailing the relationship between the user and this person"),
}).strict()
export const PersonRelationshipsSchema = z.array(PersonRelationshipSchema)

// Main Person Schema
export const EducationSchema = z.object({
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    period: PeriodSchema,
    details: z.string().describe("Long text detailing the experiences and adventures of this person in this education."),
});
export const EducationsSchema = z.array(EducationSchema)


export const EmploymentSchema = z.object({
    company: z.string(),
    role: z.string(),
    period: PeriodSchema,
    description: z.string(),
});
export const EmploymentsSchema = z.array(EmploymentSchema)
export const ResidenceSchema = z.object({
    address: z.string(),
    period: PeriodSchema,
});
export const ResidencesSchema = z.array(ResidenceSchema)

export const EventSchema = z.object({
    type: z.string().describe("Travel, Medical Event, Birth, Wedding, Example Arrest, Lawsuit, Will Creation, etc."),
    date: DateStringSchema,
    details: z.string().describe("Long text detailing what happened at this event"),
});
export const EventsSchema = z.array(EventSchema)

export const PhysicalCharacteristicsSchema = z.object({
    heightCm: z.number(),
    weightKg: z.number(),
    eyeColor: z.string(),
    hairColor: z.string(),
});

export const AssetSchema = z.object({
    name: z.string(),
    type: z.enum(['real-estate', 'vehicle', 'stocks', 'other']),
    value: z.number().describe("Numeric value, e.g., USD"),
    details: z.string().describe("Long text with all details known about this asset."),
});
export const AssetsSchema = z.array(AssetSchema)

export const PersonalInformationSchema = z.object({
    currentName: z.string(),
    birthName: z.string(),
    birthDate: DateStringSchema,
    birthPlace: z.string(),
    gender: z.enum(['Male', 'Female', 'Other']),
})

export const AttributesSchema = z.object({
    skills: z.array(z.string()),
    hobbies: z.array(z.string()),
    beliefs: z.array(z.string()),
    values: z.array(z.string())
})

export const PersonSchema = z.object({
    id: z.string().uuid().describe("Unique ID"),
    personalInformation: PersonalInformationSchema,
    attributes: AttributesSchema,
    physicalCharacteristics: PhysicalCharacteristicsSchema,

    relationships: PersonRelationshipsSchema,
    education: EducationsSchema,
    employment: EmploymentsSchema,
    residences: ResidencesSchema,
    assets: AssetsSchema,
    events: EventsSchema,
});
// Infer the TypeScript type from the schema
export type Person = z.infer<typeof PersonSchema>;
