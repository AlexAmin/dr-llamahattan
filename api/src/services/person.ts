import type {Firestore} from "firebase/firestore";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Person} from "../schemas/Person";

export const usePersonService = (db: Firestore) => {
    async function getPerson(id: string): Promise<Person | undefined> {
        const docRef = doc(db, "persons", id);
        const result = await getDoc(docRef)
        return result.data() as Person | undefined;
    }

    function setPerson(id: string, data: Person) {
        const docRef = doc(db, "persons", id);
        return setDoc(docRef, data)
    }

    return {
        getPerson,
        setPerson
    }
}