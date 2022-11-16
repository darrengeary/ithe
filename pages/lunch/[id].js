import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useReducer } from "react"
import Layout from "../../components/Layout"
import { getError } from "../../utils/error"

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, lunch: action.payload, error: "" }
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload }
    default:
      state
  }
}
function LunchScreen() {
  const { data: session } = useSession()

  const { query } = useRouter()
  const lunchId = query.id

  const [{ loading, error, lunch }, dispatch] = useReducer(reducer, {
    loading: true,
    lunch: {},
    error: "",
  })
  useEffect(() => {
    const fetchLunch = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/lunchs/${lunchId}`)
        dispatch({ type: "FETCH_SUCCESS", payload: data })
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }
    if (!lunch._id || (lunch._id && lunch._id !== lunchId)) {
      fetchLunch()
    }
  }, [lunch, lunchId])
  const { user, name } = lunch

  return (
    <Layout title={`Lunch ${lunchId}`}>
      <h1 className='mb-4 text-xl'>{`Lunch ${lunchId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='alert-error'>{error}</div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card overflow-x-auto p-5'>
              <h2 className='mb-2 text-lg'>Lunch Items</h2>
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

LunchScreen.auth = true
export default LunchScreen
