import { prisma } from ".."

async function main() {
  const actions = ['Diaper Change', 'Feeding', 'Sleeping', 'Bathing', 'Medication']

  actions.forEach(async (action) => {
    await prisma.action.upsert({
      where: { name: action },
      update: {},
      create: { name: action }
    })
  })

  const roles = ['Parent', 'Teacher', 'Admin']

  roles.forEach(async (role) => {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role }
    })
  })

  const classrooms = ['Toddler', 'Pre-K']

  classrooms.forEach(async (classroom) => {
    await prisma.classroom.upsert({
      where: { name: classroom },
      update: {},
      create: { name: classroom }
    })
  })

  const toddlerClassroom = await prisma.classroom.upsert({
    where: { name: 'Toddler' },
    update: {},
    create: { name: 'Toddler' }
  })

  const infantClassroom = await prisma.classroom.upsert({
    where: { name: 'Infant' },
    update: {},
    create: { name: 'Infant' }
  })

  // Create some default students
  const students = [
    { firstName: 'Haze', lastName: 'Wow', classroom: infantClassroom.id },
    { firstName: 'Merlina', lastName: 'Nazar', classroom: infantClassroom.id },
    { firstName: 'Henry', lastName: 'Denry', classroom: infantClassroom.id },
    { firstName: 'Jill', lastName: 'Doe', classroom: toddlerClassroom.id },
    { firstName: 'James', lastName: 'Smith', classroom: toddlerClassroom.id },
    { firstName: 'Jenny', lastName: 'Trump', classroom: toddlerClassroom.id },
  ]

  students.map(async (student) => {
    await prisma.student.create({
      data: {
        firstName: student.firstName,
        lastName: student.lastName,
        profilePicture: 'https://i.pravatar.cc/300',
        dob: new Date(),
        classrooms: {
          create: {
            classroomId: student.classroom
          }
        },
        contactInfos: {
          createMany: {
            data: [
              {
                firstName: `mom - ${student.firstName}`,
                lastName: `mom - ${student.lastName}`,
                email: `${student.firstName}@email`,
                phone: '1234567890',
                relationship: 'Mother'
              }
            ]
          }
        }
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
