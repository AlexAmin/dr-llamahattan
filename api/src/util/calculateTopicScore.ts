import {Person} from "../schemas/Person";
import {Topic} from "../schemas/Checklist";

export function calculateTopicScore(person: Person, topic: Topic): number {
    let length = 0
    // LLAMA6
    if (topic === Topic.PersonalInformation) length = JSON.stringify(person?.personalInformation || {}).length
    if (topic === Topic.Attributes) length = JSON.stringify(person?.attributes || {}).length
    if (topic === Topic.PhysicalCharacteristics) length = JSON.stringify(person?.physicalCharacteristics || {}).length
    if (topic === Topic.Relationships) length = JSON.stringify(person?.relationships || []).length
    if (topic === Topic.Education) length = JSON.stringify(person?.education || []).length
    if (topic === Topic.Employment) length = JSON.stringify(person?.employment || []).length
    if (topic === Topic.Residences) length = JSON.stringify(person?.residences || []).length
    if (topic === Topic.Assets) length = JSON.stringify(person?.assets || []).length
    if (topic === Topic.Events) length = JSON.stringify(person?.events || []).length

    if (length < 50) return 0.25
    if (length < 100) return 0.50
    if (length < 150) return 0.75
    else return 1.00
}