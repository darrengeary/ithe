import Link from "next/link"
import React, { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import Layout from "../components/Layout"
import { getError } from "../utils/error"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import axios from "axios"
import ReCAPTCHA from "react-google-recaptcha"

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
    getValues,
    formState: { errors },
  } = useForm()
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      })

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
    <Layout title='Create Account'>
      <div className='height'>
        <form
          className='centered mx-auto max-w-screen-sm'
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className='row tab-cont d-flex justify-content-evenly text-center'>
            <Link href={`/login?redirect=${redirect || "/"}`}>
              <h1 className='col-6 tab-login text-xl'>Login</h1>
            </Link>
            <h1 className='col-6 tab-login register-active text-xl'>
              Register
            </h1>
          </div>
          <div className='input-cont bg-blue'>
            <div className='input mb-3'>
              <input
                placeholder='Name'
                type='text'
                className='w-full input'
                id='name'
                autoFocus
                {...register("name", {
                  required: "Please enter name",
                })}
              />
              {errors.name && (
                <div className='text-red-500'>{errors.name.message}</div>
              )}
            </div>
            <div className='input mb-3'>
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
              ></input>
              {errors.email && (
                <div className='text-red-500'>{errors.email.message}</div>
              )}
            </div>
            <div className='input mb-3'>
              <input
                placeholder='Password'
                type='password'
                {...register("password", {
                  required: "Please enter password",
                  minLength: {
                    value: 6,
                    message: "Password is more than 5 chars",
                  },
                })}
                className='w-full input'
                id='password'
              ></input>
              {errors.password && (
                <div className='text-red-500 '>{errors.password.message}</div>
              )}
            </div>
            <div className='input mb-3'>
              <input
                placeholder='Verify Password'
                className='w-full input'
                type='password'
                id='confirmPassword'
                {...register("confirmPassword", {
                  required: "Please enter confirm password",
                  validate: (value) => value === getValues("password"),
                  minLength: {
                    value: 6,
                    message: "confirm password is more than 5 chars",
                  },
                })}
              />
              {errors.confirmPassword && (
                <div className='text-red-500 '>
                  {errors.confirmPassword.message}
                </div>
              )}
              {errors.confirmPassword &&
                errors.confirmPassword.type === "validate" && (
                  <div className='text-red-500 '>Password do not match</div>
                )}
            </div>
            <div className='captcha'>
              <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
            </div>
            <div className='mb-4 text-center'>
              <button className='register-button primary-button'>
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
