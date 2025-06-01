import type {Firestore} from "firebase/firestore";
import {collection, doc, getDocs, query, setDoc, where} from "firebase/firestore";
import {Transcription} from "../schemas/Transcription";

const TRANSCRIPTIONS_COLLECTION = "transcriptions";

export const useTranscriptionsService = (db: Firestore) => {
    async function getTranscriptionsForUser(userId: string) {
        const q = query(
            collection(db, TRANSCRIPTIONS_COLLECTION),
            where("userId", "==", userId)
        );

        return getDocs(q);
    }

    async function addTranscription(transcription: string, userId: string) {
        const docRef = doc(collection(db, TRANSCRIPTIONS_COLLECTION));
        return setDoc(docRef, {
            transcription,
            userId
        } satisfies Transcription);
    }

    return {
        getTranscriptionsForUser,
        addTranscription
    }
}