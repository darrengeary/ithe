import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useReducer } from "react"
import Layout from "/components/Layout.js"
import { getError } from "../../../utils/error"

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, pupil: action.payload, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }
    default:
      state
  }
}
function PupilScreen() {
  const { data: session } = useSession()

  const { query } = useRouter()
  const pupilId = query.id

  const [{ loading, error, pupil }, dispatch] = useReducer(reducer, {
    loading: true,
    pupil: {},
    error: "",
  })
  useEffect(() => {
    const fetchPupil = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/pupils/${pupilId}`)
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }
    if (!pupil._id || (pupil._id && pupil._id !== pupilId)) {
      fetchPupil()
    }
  }, [pupil, pupilId])
  const { user, name } = pupil

  return (
    <Layout title={`Pupil ${pupilId}`}>
      <h1 className='mb-4 text-xl'>{`Pupil ${pupilId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card overflow-x-auto p-5'>
              <h2 className='mb-2 text-lg'>Pupil Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>{name}</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </Layout>
  )
}

PupilScreen.auth = true
export default PupilScreen
