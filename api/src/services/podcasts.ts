import {collection, doc, Firestore, getDoc, getDocs, query, setDoc, where} from "firebase/firestore";
import {Podcast} from "../schemas/Podcast";
import {PodcastSummary} from "../schemas/PodcastSummary";

const PODCASTS_COLLECTION = "podcasts";
export const usePodcastsService = (db: Firestore) => {
    async function getPodcasts(userId: string): Promise<PodcastSummary[]> {
        const q = query(
            collection(db, PODCASTS_COLLECTION),
            where("userId", "==", userId)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            summary: doc.data().summary
        }));
    }

    async function getPodcast(id: string): Promise<Podcast | undefined> {
        const docRef = doc(db, PODCASTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as Podcast : undefined;
    }

    async function addPodcast(podcast: Podcast) {
        const collectionRef = collection(db, PODCASTS_COLLECTION);
        const docRef = doc(collectionRef);
        await setDoc(docRef, podcast);
        return docRef.id;
    }

    async function updatePodcast(id: string, podcast: Podcast) {
        const docRef = doc(db, PODCASTS_COLLECTION, id);
        await setDoc(docRef, podcast);
        return id;
    }

    return {
        getPodcasts,
        getPodcast,
        addPodcast,
        updatePodcast
    } as const;
}