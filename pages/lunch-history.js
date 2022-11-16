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
      return { ...state, loading: false, lunchs: action.payload, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
function LunchHistoryScreen() {
  const [{ loading, error, lunchs }, dispatch] = useReducer(reducer, {
    loading: true,
    lunchs: [],
    error: "",
  })

  useEffect(() => {
    const fetchLunchs = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/lunchs/history`)
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }
    fetchLunchs()
  }, [])
  return (
    <Layout title='Lunch History'>
      <h1 className='mb-4 text-xl'>Lunch History</h1>
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
              {lunchs.map((lunch) => (
                <tr key={lunch._id} className='border-b'>
                  <td className=' p-5 '>{lunch._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}

LunchHistoryScreen.auth = true
export default LunchHistoryScreen
