"use server"

import { dbConnect } from "../../lib/mongo"
import User from "../../models/user"
import { RegisterSchema } from "../../schema/auth/registerSchema"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { signIn,signOut } from "../../auth"
import { LoginSchema } from "../../schema/auth/loginSchema"



export async function doSocialLogin(formData) {
  const action = formData.get("action")
  await signIn(action, { redirectTo: "/" })
}

export async function doLogout() {
  await signOut({ redirectTo: "/" })
}

export async function doCredentialLogin(prevState,formData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log("validate pass")

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" })

    revalidatePath("/dashboard")
  } catch (error) {
    if (error) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid Credentials!!!" }
        default:
          return { message: "Something went wrong" }
      }
    }

    throw error
  }
}

export const doCredentialRegister = async (prevState, formData) => {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }
  console.log("validation pass")

  const { username, email, password } = validatedFields.data
  const hashedPassword = bcrypt.hashSync(password, 10)

  console.log("hash pass " + hashedPassword)

  await dbConnect()

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return {
        message: "Email already exists!!!",
      }
    }

    console.log("email pass")

    // Create the new user
    const user = new User({ username, email, password: hashedPassword })
    await user.save()

  } catch (error) {
    console.log("failed")
    if (error instanceof Error) {
      console.log("error" + error.message)
      return {
        message: error.message,
      }
    } else {
      console.log("some error")
      return {
        message: "Failed to register user",
      }
    }
  }

  redirect("/login")
}
