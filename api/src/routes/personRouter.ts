import {Context, Hono} from "hono";
import {Firestore} from "firebase/firestore";
import {usePodcastsService} from "../services/podcasts";
import {promptPodcast} from "../prompting/promptPodcast";
import {usePersonService} from "../services/person";
import {promptPodcastSummary} from "../prompting/promptPodcastSummary";
import {Podcast} from "../schemas/Podcast";
import {PodcastChapter} from "../schemas/PodcastChapter";
import {promptPodcastChapters} from "../prompting/promptPodcastChapters";
import {PodcastText} from "../schemas/PodcastText";
import {generateCoverImage} from "../google/generateCoverImage";
import {FirebaseApp} from "firebase/app";
import {Person} from "../schemas/Person";
import {generateSpeech} from "../google/generateSpeech";

export const PersonRouter = new Hono()

PersonRouter.get("/", async (c: Context, next) => {
    const db: Firestore = c.get("db")
    const userId = c.get("userId")
    const person = await usePersonService(db).getPerson(userId)
    return c.json(person)
})
