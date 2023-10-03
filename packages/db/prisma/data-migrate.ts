import { prisma } from ".."
import glob from "glob"

async function main() {
  const lastDataMigration = await prisma.dataMigration.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  })

  glob("prisma/data-migrations/*.ts", async (err, files) => {
    if (err) {
      console.error(err)
    }

    files.forEach(async (file) => {
      const key = file?.split("/")?.pop()?.split(".")[0]?.split("_")?.[2]
      if (!key) throw new Error("No key found")
      const numberKey = +key

      if (!lastDataMigration || numberKey > lastDataMigration.key) {
        console.log(`Running migration ${numberKey}`)

        const fileName = file?.split("/")?.pop()?.split(".")[0]

        if (!fileName) {
          throw new Error("No file name found")
        }

        const currentMigration = await prisma.dataMigration.create({
          data: {
            key: numberKey,
            startedAt: new Date(),
            filename: fileName,
          }
        })

        const { default: migration } = await import(`./data-migrations/${fileName}`)
        await migration()

        await prisma.dataMigration.update({
          where: {
            id: currentMigration.id,
          },
          data: {
            finishedAt: new Date(),
          }
        })
      }
    })
  })
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
