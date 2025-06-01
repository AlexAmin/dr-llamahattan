import type {Firestore} from "firebase/firestore";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Checklist} from "../schemas/Checklist";

export const useChecklistService = (db: Firestore) => {
    async function getChecklist(userId: string): Promise<Checklist[] | undefined> {
        const docRef = doc(db, "checklist", userId);
        const result = await getDoc(docRef)
        return result.data() as Checklist[] || []
    }

    function setChecklist(userId: string, checklist: Checklist[]) {
        const docRef = doc(db, "checklist", userId);
        return setDoc(docRef, checklist)
    }

    return {
        getChecklist,
        setChecklist
    }
}