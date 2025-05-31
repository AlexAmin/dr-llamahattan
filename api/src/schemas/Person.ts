import {z} from 'zod';

// Reusable Schemas
const DateStringSchema = z.string().describe("ISO String")
const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
})

const PeriodSchema = z.object({
    startDate: DateStringSchema,
    endDate: DateStringSchema.optional().describe("End date can be null for current events"),
});


export const PersonRelationshipSchema = z.object({
    type: z.enum(['Parent', 'Child', 'Spouse', 'Partner', 'Sibling', 'Friend', 'Professional', 'Other']),
    details: z.string().optional().describe("e.g. married on, colleague at, friends since, etc. "),
})
export const PersonRelationshipsSchema = z.array(PersonRelationshipSchema)
// Main Person Schema
export const EducationSchema = z.object({
    institution: z.string(),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    period: PeriodSchema,
});
export const EducationsSchema = z.array(EducationSchema)


export const EmploymentSchema = z.object({
    company: z.string(),
    role: z.string(),
    period: PeriodSchema,
    description: z.string().optional(),
});
export const EmploymentsSchema = z.array(EmploymentSchema)
export const ResidenceSchema = z.object({
    address: AddressSchema,
    period: PeriodSchema,
});
export const ResidencesSchema = z.array(ResidenceSchema)

export const TravelSchema = z.object({
    destination: z.string(),
    period: PeriodSchema,
    notes: z.string().optional(),
});

export const MilestoneSchema = z.object({
    name: z.string().describe("Marriage, first child born, etc."),
    date: DateStringSchema,
    description: z.string().optional(),
});

export const MedicalHistorySchema = z.object({
    condition: z.string(),
    diagnosisDate: DateStringSchema.optional(),
    treatment: z.string().optional(),
    notes: z.string().optional(),
});

export const LegalEventSchema = z.object({
    type: z.string().describe("Example Arrest, Lawsuit, Will Creation"),
    date: DateStringSchema,
    details: z.string().optional(),
});

export const PhysicalCharacteristicsSchema = z.object({
    heightCm: z.number().optional(),
    weightKg: z.number().optional(),
    eyeColor: z.string().optional(),
    hairColor: z.string().optional(),
});

export const SocialMediaSchema = z.object({
    platform: z.string(),
    handle: z.string(),
    url: z.string().url().optional(),
});

export const DigitalFootprintSchema = z.object({
    socialMedia: z.array(SocialMediaSchema).optional(),
    emails: z.array(z.string().email()).optional(),
    phoneNumbers: z.array(z.string()).optional().describe("Consider more robust phone number validation if needed"),
    websites: z.array(z.string().url()).optional(),
});

export const AssetSchema = z.object({
    name: z.string(),
    type: z.string().optional().describe('e.g., "Real Estate", "Vehicle", "Financial Account"'),
    value: z.number().optional().describe("Numeric value, e.g., USD"),
    details: z.string().optional(),
});
export const AssetsSchema = z.array(AssetSchema)

export const PersonalInformationSchema = z.object({
    currentName: z.string(),
    birthName: z.string(),
    birthDate: DateStringSchema,
    birthPlace: AddressSchema,
    gender: z.enum(['Male', 'Female', 'Other']),
})

export const AttributesSchema = z.object({
    skills: z.array(z.string()).optional(),
    hobbies: z.array(z.string()).optional(),
    beliefs: z.array(z.string()).optional(),
    values: z.array(z.string()).optional(),
    personalityTraits: z.array(z.string()).optional(),
})

export const PersonSchema = z.object({
    id: z.string().uuid().describe("Unique ID"),
    personalInformation: PersonalInformationSchema.optional(),
    attributes: AttributesSchema.optional(),
    physicalCharacteristics: PhysicalCharacteristicsSchema.optional(),
    digitalFootprint: DigitalFootprintSchema.optional(),

    relationships: PersonRelationshipsSchema.optional(),
    education: EducationsSchema.optional(),
    employment: EmploymentsSchema.optional(),
    residences: ResidencesSchema.optional(),
    assets: AssetsSchema.optional(),
});
// Infer the TypeScript type from the schema
export type Person = z.infer<typeof PersonSchema>;
