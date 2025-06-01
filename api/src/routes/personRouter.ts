import {Context, Hono} from "hono";
import {Firestore} from "firebase/firestore";
import {usePersonService} from "../services/person";

export const PersonRouter = new Hono()

PersonRouter.get("/me", async (c: Context, next) => {
    const db: Firestore = c.get("db")
    const userId = c.get("userId")
    const person = await usePersonService(db).getPerson(userId)
    return c.json(person)
})

PersonRouter.get("/", async (c: Context, next) => {
    const db: Firestore = c.get("db")
    const userId = c.get("userId")
    const persons = await usePersonService(db).getAllPersons()
    return c.json(persons)
})

PersonRouter.post("/", async (c: Context, next) => {
    const db: Firestore = c.get("db")
    const id = await usePersonService(db).createPerson()
    return c.json({id})
})

PersonRouter.delete("/:userId", async (c: Context, next) => {
    const db: Firestore = c.get("db")
    const userId = c.req.param("userId")
    const id = await usePersonService(db).deletePerson(userId)
    return c.json({id})
})
