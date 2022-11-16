import axios from "axios"
import Link from "next/link"
import React, { useEffect, useReducer } from "react"
import Layout from "../components/Layout"
import { getError } from "../utils/error"

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, pupils: action.payload, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
function PupilHistoryScreen() {
  const [{ loading, error, pupils }, dispatch] = useReducer(reducer, {
    loading: true,
    pupils: [],
    error: "",
  })

  useEffect(() => {
    const fetchPupils = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/pupils/history`)
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }
    fetchPupils()
  }, [])
  return (
    <Layout title='Pupil History'>
      <div className='d-flex justify-content-between bg-blue blue-section '>
        <h1 className='d-flex align-items-center text-xl'>My Pupils</h1>
        <div className='flex justify-content-end'>
          <button className='primary-button add-button'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 4.5v15m7.5-7.5h-15'
              />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <tbody>
              {pupils.map((pupil) => (
                <Link href={`/pupil/${pupil._id}/`}>
                  <div className='bg-blue blue-section'>
                    <tr key={pupil.name}>
                      <td>{pupil.name}</td>
                    </tr>
                  </div>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}

PupilHistoryScreen.auth = true
export default PupilHistoryScreen
