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

export const PodcastsRouter = new Hono()

PodcastsRouter.get("/", async (c: Context, next) => {
    const db: Firestore = c.get("db")
    const userId = c.get("userId")
    const podcasts = await usePodcastsService(db).getPodcasts(userId)
    return c.json(podcasts)
})


PodcastsRouter.post("/", async (c: Context, next) => {
    const db: Firestore = c.get("db")
    const firebaseApp: FirebaseApp = c.get("firebaseApp")
    const userId = c.get("userId")
    const body = await c.req.json()
    const duration = body.duration
    const topic = body.topic

    console.log("Loading person")
    const person: Person | undefined = await usePersonService(db).getPerson(userId)
    if(!person) return c.status(500)
    console.log("Generating chapters")
    const chapters: PodcastChapter[] = await promptPodcastChapters(topic, duration, person)
    console.log("Generating podcast")
    const podcastTexts: PodcastText[][] = await Promise.all(
        chapters.map((chapter, index) =>
            promptPodcast(topic, duration, person, chapter, index, chapters.length))
    )
    const podcastText: PodcastText[] = podcastTexts.flat()
    console.log("Generating summary")
    const summary: string = await promptPodcastSummary(podcastText)
    const podcast: Podcast = {
        chapters: chapters,
        text: podcastText,
        summary: summary,
        duration: duration,
        createdAt: new Date(),
        topic: topic,
        userId,
    }
    console.log("Saving podcast")
    const id = await usePodcastsService(db).addPodcast(podcast)
    console.log("Generating cover image")
    const url = await generateCoverImage(id, chapters, firebaseApp)
    console.log("generate audio")
    const audioURL = await generateSpeech(id, firebaseApp, podcastText)
    console.log("cover image", url)
    console.log("audio url", audioURL)
    return c.json(podcast)
})
