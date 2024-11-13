"use client"

import { doCredentialLogin } from "../../app/actions"
import Link from "next/link"
import { useActionState } from "react"

export default function FormLogin() {
  const [state, formAction] = useActionState(doCredentialLogin, null)
  return (
    <form action={formAction}>
      <input type="email" name="email" placeholder="Email" />
      <p className="text-red-500">{state?.error?.email}</p>
      <input type="password" name="password" placeholder="Password" />
      <p className="text-red-500">{state?.error?.password}</p>
      <button type="submit">Login</button>
      <Link href="/register">register</Link>
    </form>
  )
}
