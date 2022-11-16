import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useReducer } from "react"
import { toast } from "react-toastify"
import Layout from "../../../../components/Layout"
import { getError } from "../../../../utils/error"

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, classrooms: action.payload, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true }
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false }
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false }
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true }
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true }
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false }
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false }

    default:
      state
  }
}
export default function AdminClassroomScreen() {
  const router = useRouter()
  const { query } = useRouter()
  const schoolId = query.id

  const [
    { loading, error, classrooms, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    classrooms: [],
    error: "",
  })

  const createHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" })

      const { data } = await axios.post(`/api/admin/classrooms`, {
        params: { schoolId: schoolId },
      })
      dispatch({ type: "CREATE_SUCCESS" })
      router.push(`/admin/classroom/${data.classroom._id}`)
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" })
      toast.error(getError(err))
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/admin/classrooms/`, {
          params: { schoolId: schoolId },
        })
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" })
    } else {
      fetchData()
    }
  }, [successDelete])

  return (
    <Layout title='Admin Classroom'>
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
        <div className='overflow-x-auto md:col-span-3'>
          <div className='flex justify-between'>
            <h1 className='mb-4 text-xl'>Classroom</h1>
          </div>
          <div className='flex justify-end'>
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className='primary-button mr-5'
            >
              All Registration Letters
            </button>
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className='primary-button'
            >
              {loadingCreate ? "Loading" : "Create"}
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className='alert-error'>{error}</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='p-5 text-left'>NAME</th>
                    <th className='p-5 text-left'>REGISTERED PUPILS</th>
                    <th className='p-5 text-left'>TOTAL PUPILS</th>
                  </tr>
                </thead>
                <tbody>
                  {classrooms.map((classroom) => (
                    <tr key={classroom._id} className='border-b'>
                      <td className=' p-5 '>{classroom.name}</td>
                      <td className=' p-5 '>{classroom.totalPupils}</td>
                      <td className=' p-5 '>{classroom.totalPupils}</td>
                      <td className=' p-5 '>
                        <Link href={`/admin/classroom/${classroom._id}`}>
                          <a type='button' className='default-button'>
                            Registration Letters
                          </a>
                        </Link>
                      </td>
                      <td className=' p-5 '>
                        <Link href={`/admin/classroom/${classroom._id}`}>
                          <a type='button' className='default-button'>
                            Edit Classroom
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

AdminClassroomScreen.auth = { adminOnly: true }
