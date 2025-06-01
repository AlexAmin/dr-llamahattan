export interface Period {
    startDate: string;
    endDate: string;
}

export interface PersonRelationship {
    name: string;
    type: 'Parent' | 'Child' | 'Spouse' | 'Partner' | 'Sibling' | 'Friend' | 'Professional' | 'Other';
    details: string;
}

export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    period: Period;
    details: string;
}

export interface Employment {
    company: string;
    role: string;
    period: Period;
    description: string;
}

export interface Residence {
    address: string;
    period: Period;
}

export interface Event {
    type: string;
    date: string;
    details: string;
}

export interface PhysicalCharacteristics {
    heightCm: number;
    weightKg: number;
    eyeColor: string;
    hairColor: string;
}

export interface Asset {
    name: string;
    type: 'real-estate' | 'vehicle' | 'stocks' | 'other';
    value: number;
    details: string;
}

export interface PersonalInformation {
    currentName: string;
    birthName: string;
    birthDate: string;
    birthPlace: string;
    gender: 'Male' | 'Female' | 'Other';
}

export interface Attributes {
    skills: string[];
    hobbies: string[];
    beliefs: string[];
    values: string[];
}

export interface Person {
    id: string;
    personalInformation: PersonalInformation;
    attributes: Attributes;
    physicalCharacteristics: PhysicalCharacteristics;
    relationships: PersonRelationship[];
    education: Education[];
    employment: Employment[];
    residences: Residence[];
    assets: Asset[];
    events: Event[];
}

export interface PersonItem {
    id: string
    name?: string
}
