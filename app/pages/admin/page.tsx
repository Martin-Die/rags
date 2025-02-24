import { db } from "@/app/db"
import { postsTable } from "@/app/db/schema"

export default function Admin() {
    return (
        <main>
            <div>
                <form action={async () => {
                    'user server'
                    await db.insert(postsTable).values({
                        title: "Hello",
                        content: "Yolo",
                        userId: 1,
                    })
                }}>
                    <button>submit</button>
                </form>
            </div>
        </main>
    )
}