import Link from "next/link"
import React, { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import Layout from "../components/Layout"
import { getError } from "../utils/error"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

export default function LoginScreen() {
  const { data: session } = useSession()

  const router = useRouter()
  const { redirect } = router.query

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/")
    }
  }, [router, session, redirect])

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }
  return (
    <Layout title='Login'>
      <form
        className='centered mx-auto w-60'
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className='row tab-cont d-flex justify-content-evenly text-center'>
          <h1 className='col-6 tab-login login-active text-xl'>Login</h1>
          <Link href={`/register?redirect=${redirect || "/"}`}>
            <h1 className='col-6 tab-login text-xl'>Register</h1>
          </Link>
        </div>
        <div className='input-cont bg-blue'>
          <div className='mb-3'>
            <input
              placeholder='Email'
              type='email'
              {...register("email", {
                required: "Please enter email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "Please enter valid email",
                },
              })}
              className='w-full input'
              id='email'
              autoFocus
            ></input>
            {errors.email && (
              <div className='text-red-500'>{errors.email.message}</div>
            )}
          </div>
          <div className='mb-3'>
            <input
              placeholder='Password'
              type='password'
              {...register("password", {
                required: "Please enter password",
                minLength: {
                  value: 6,
                  message: "password is more than 5 chars",
                },
              })}
              className='w-full input'
              id='password'
            ></input>
            {errors.password && (
              <div className='text-red-500 '>{errors.password.message}</div>
            )}
          </div>
          <div className='mb-3 '>
            <button className='login-button primary-button'>Login</button>
          </div>
          <div className='mb-3 '>
            <p className='text-login'>
              <Link
                className='no-deco'
                href={`/register?redirect=${redirect || "/"}`}
              >
                Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </form>
    </Layout>
  )
}
