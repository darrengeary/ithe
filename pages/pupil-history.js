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
      <h1 className='mb-4 text-xl'>Pupil History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='border-b'>
              <tr>
                <th className='px-5 text-left'>ID</th>
              </tr>
            </thead>
            <tbody>
              {pupils.map((pupil) => (
                <tr key={pupil._id} className='border-b'>
                  <td className=' p-5 '>{pupil._id}</td>
                </tr>
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
