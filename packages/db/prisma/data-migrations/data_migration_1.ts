import { prisma } from "../../"

import { clerkClient } from "@clerk/nextjs"

export const syncClerkUsers = async () => {
  const users = await clerkClient.users.getUserList()

  users.forEach(async user => {
    if (!user.emailAddresses[0]?.emailAddress) return

    await prisma.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    })
  })
}

syncClerkUsers()
