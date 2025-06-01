import type {Firestore} from "firebase/firestore";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Person} from "../schemas/Person";

export const useQuestionService = (db: Firestore) => {
    async function getQuestion(userId: string): Promise<Person | undefined> {
        const docRef = doc(db, "question", userId);
        const result = await getDoc(docRef)
        return result.data()?.data||""
    }

    function setQuestion(userId: string, data: string) {
        const docRef = doc(db, "question", userId);
        return setDoc(docRef, {data})
    }

    return {
        getQuestion,
        setQuestion
    }
}