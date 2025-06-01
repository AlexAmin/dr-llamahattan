import {deleteDoc, Firestore} from "firebase/firestore";
import {collection, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {Person} from "../schemas/Person";

export const usePersonService = (db: Firestore) => {
    async function getPerson(id: string): Promise<Person | undefined> {
        const docRef = doc(db, "persons", id);
        const result = await getDoc(docRef)
        return result.data() as Person | undefined;
    }

    async function getAllPersons(): Promise<{ id: string, name: string }[]> {
        const querySnapshot = await getDocs(collection(db, "persons"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: (doc.data() as Person).personalInformation?.currentName
        }));
    }

    function setPerson(id: string, data: Person) {
        const docRef = doc(db, "persons", id);
        return setDoc(docRef, data)
    }

    function deletePerson(id: string) {
        const docRef = doc(db, "persons", id);
        return deleteDoc(docRef)
    }

    async function createPerson() {
        const collectionRef = collection(db, "persons");
        const docRef = doc(collectionRef);
        await setDoc(docRef, {});
        return docRef.id
    }

    return {
        deletePerson,
        createPerson,
        getAllPersons,
        getPerson,
        setPerson
    }
}