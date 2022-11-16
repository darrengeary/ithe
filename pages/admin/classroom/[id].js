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
export default function AdminClassroomEditScreen() {
  const { query } = useRouter()
  const classroomId = query.id
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
        const { data } = await axios.get(`/api/admin/classrooms/${classroomId}`)
        dispatch({ type: "FETCH_SUCCESS" })
        setValue("name", data.name)
        setValue("totalPupils", data.totalPupils)
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }

    fetchData()
  }, [classroomId, setValue])

  const router = useRouter()

  const deleteHandler = async () => {
    if (
      !window.confirm(
        "Any pupils registered with this class will no longer be able to order. Are you sure?"
      )
    ) {
      return
    }
    try {
      dispatch({ type: "DELETE_REQUEST" })
      await axios.delete(`/api/admin/classrooms/${classroomId}`)
      dispatch({ type: "DELETE_SUCCESS" })
      toast.success("Classroom Deleted")
      router.back()
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" })
      toast.error(getError(err))
    }
  }
  const submitHandler = async ({ name, totalPupils }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" })
      await axios.put(`/api/admin/classrooms/${classroomId}`, {
        name,
        totalPupils,
      })
      dispatch({ type: "UPDATE_SUCCESS" })
      toast.success("Classroom updated successfully")
      router.back()
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) })
      toast.error(getError(err))
    }
  }

  return (
    <Layout title={`Edit Classroom ${classroomId}`}>
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
              <h1 className='mb-4 text-xl'>{`Edit Classroom ${classroomId}`}</h1>
              <div className='mb-4'>
                <label htmlFor='name'>Name</label>
                <input
                  type='text'
                  className='w-full'
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
              <div className='mb-4'>
                <label htmlFor='name'>Number of Pupils</label>
                <input
                  type='number'
                  className='w-full'
                  id='totalPupils'
                  {...register("totalPupils", {
                    required: "Please enter number of pupils",
                  })}
                />
                {errors.totalPupils && (
                  <div className='text-red-500'>
                    {errors.totalPupils.message}
                  </div>
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
              <div className='mb-4'>
                <a onClick={() => deleteHandler()} className='cursor-pointer'>
                  Delete Classroom
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminClassroomEditScreen.auth = { adminOnly: true }
