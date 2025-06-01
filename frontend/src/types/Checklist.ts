export enum Quality {
    good = "good",
    bad = "bad",
    missing = "missing",
}

export interface Checklist {
    personalInformation: Quality;
    attributes: Quality;
    physicalCharacteristics: Quality;
    relationships: Quality;
    education: Quality;
    employment: Quality;
    residences: Quality;
    assets: Quality;
    events: Quality;
}