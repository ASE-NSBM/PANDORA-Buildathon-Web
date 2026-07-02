export type Member = {
  fullName: string
  studentId: string
  email: string
  contactNumber: string
  whatsappNumber: string
}

export type Registration = {
  _id: string
  teamName: string
  memberCount: number
  members: Member[]
  createdAt: Date
}
