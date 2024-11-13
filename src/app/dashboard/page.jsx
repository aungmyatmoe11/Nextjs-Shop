import { auth } from "../../auth"
import React from "react"

export default async function DashboardPage() {
  const session = await auth()

  console.log('session', session)
  return (
    <>
      <div>Dashboard Page</div>
      <p>WELCOME BACK : {session?.user?.email}</p>
      <p>{JSON.stringify(session)}</p>
    </>
  )
}
