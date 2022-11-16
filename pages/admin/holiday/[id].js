import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useReducer } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import Layout from "../../../components/Layout"
import { getError } from "../../../utils/error"

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" }
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" }
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload }

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" }
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      }
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload }

    default:
      return state
  }
}
export default function AdminHolidayEditScreen() {
  const { query } = useRouter()
  const holidayId = query.id
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/admin/holidays/${holidayId}`)
        dispatch({ type: "FETCH_SUCCESS" })
        setValue("startDate", data.startDate)
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }

    fetchData()
  }, [holidayId, setValue])

  const router = useRouter()

  const submitHandler = async ({ startDate }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" })
      console.log(startDate)
      await axios.put(`/api/admin/holidays/${holidayId}`, {
        startDate,
      })
      dispatch({ type: "UPDATE_SUCCESS" })
      toast.success("Holiday updated successfully")
      router.back()
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) })
      toast.error(getError(err))
    }
  }

  return (
    <Layout title={`Edit Holiday ${holidayId}`}>
      <div className='grid md:grid-cols-4 md:gap-5'>
        <div>
          <ul>
            <li>
              <Link href='/admin/dashboard'>Dashboard</Link>
            </li>
            <li>
              <Link href='/admin/meals'>Meals</Link>
            </li>
            <li>
              <Link href='/admin/schools'>
                <a className='font-bold'>Schools</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className='md:col-span-3'>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <form
              className='mx-auto max-w-screen-md'
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className='mb-4 text-xl'>{`Edit Holiday ${holidayId}`}</h1>
              <div className='mb-4'>
                <label htmlFor='startDate'>Start Date</label>
                <input
                  type='date'
                  className='w-full'
                  id='startDate'
                  autoFocus
                  {...register("startDate", {
                    required: "Please enter start date",
                  })}
                />
                {errors.startDate && (
                  <div className='text-red-500'>{errors.startDate.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <button disabled={loadingUpdate} className='primary-button'>
                  {loadingUpdate ? "Loading" : "Update"}
                </button>
              </div>
              <div className='mb-4'>
                <a onClick={() => router.back()} className='cursor-pointer'>
                  Back
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminHolidayEditScreen.auth = { adminOnly: true }
