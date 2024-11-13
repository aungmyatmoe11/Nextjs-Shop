"use client"

import { doCredentialRegister } from "../../app/actions"
import Link from "next/link"
import { useActionState } from "react"

export default function FormRegister() {
  const [state, formAction] = useActionState(doCredentialRegister, null)
  return (
    <form action={formAction}>
      <input type="text" name="username" placeholder="Username" />
      <p className="text-red-500">{state?.error?.username}</p>
      <input type="email" name="email" placeholder="Email" />
      <p className="text-red-500">{state?.error?.email}</p>
      <input type="password" name="password" placeholder="Password" />
      <p className="text-red-500">{state?.error?.password}</p>
      <input
        type="password"
        name="confirmPassword"
        placeholder="confirmPassword"
      />
      <p className="text-red-500">{state?.error?.confirmPassword}</p>
      <button type="submit">Register</button>
      <Link href="/login">Login</Link>
    </form>
  )
}
