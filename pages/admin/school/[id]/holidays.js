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
      return { ...state, loading: false, holidays: action.payload, error: "" }
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
export default function AdminHolidayScreen() {
  const router = useRouter()
  const { query } = useRouter()
  const schoolId = query.id

  const [
    { loading, error, holidays, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    holidays: [],
    error: "",
  })

  const createHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" })

      const { data } = await axios.post(`/api/admin/holidays`, {
        params: { schoolId: schoolId },
      })
      dispatch({ type: "CREATE_SUCCESS" })
      router.push(`/admin/holiday/${data.holiday._id}`)
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" })
      toast.error(getError(err))
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/admin/holidays/`, {
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

  const deleteHandler = async (holiday) => {
    if (!window.confirm("Delete " + holiday.name + "?")) {
      return
    }
    try {
      dispatch({ type: "DELETE_REQUEST" })
      await axios.delete(`/api/admin/holidays/${holiday._id}`)
      dispatch({ type: "DELETE_SUCCESS" })
      toast.success("Holiday Deleted")
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" })
      toast.error(getError(err))
    }
  }
  return (
    <Layout title='Admin Holiday'>
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
            <h1 className='mb-4 text-xl'>Holiday</h1>
            {loadingDelete && <div>Deleting item...</div>}
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
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((holiday) => (
                    <tr key={holiday._id} className='border-b'>
                      <td className=' p-5 '>{holiday.name}</td>
                      <td className=' p-5 '>
                        {new Date(holiday.startDate).toDateString()}
                      </td>
                      <td className=' p-5 '>
                        {holiday.startDate != holiday.endDate
                          ? new Date(holiday.endDate).toDateString()
                          : ""}
                      </td>
                      <td className=' p-5 '>
                        <Link href={`/admin/holiday/${holiday._id}`}>
                          <a type='button' className='default-button'>
                            Edit
                          </a>
                        </Link>
                        &nbsp;
                        <button
                          onClick={() => deleteHandler(holiday)}
                          className='default-button'
                          type='button'
                        >
                          Delete
                        </button>
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

AdminHolidayScreen.auth = { adminOnly: true }
