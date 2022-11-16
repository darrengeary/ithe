import axios from "axios"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
  useReducer,
} from "react"
import { toast } from "react-toastify"
import Layout from "../../../components/Layout.js"
import { getError } from "../../../utils/error"
import {
  DndCalendar,
  momentLocalizer,
  Views,
  DateLocalizer,
} from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import Year from "../../../components/Year.js"
import Week from "../../../components/WorkWeek_custom.js"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"

export default function RegisterLunchScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { status, data: session } = useSession()

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

  useEffect(() => {
    const fetchLunchs = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" })
        const { data } = await axios.get(`/api/lunchs/history`)
        dispatch({ type: "FETCH_SUCCESS", payload: data })
        setEvents(data)
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) })
      }
    }
    fetchLunchs()
  }, [])

  const submitHandler = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post("/api/lunchs", {
        name: "egg",
        start: new Date(),
        end: new Date(),
      })
      console.log(data)
      setLoading(false)
      router.push(`/lunch/${data._id}`)
    } catch (err) {
      setLoading(false)
      toast.error(getError(err))
    }
  }

  return (
    <Layout title='Create Lunch Order'>
      <h1 className='mb-4 text-xl'>Create Lunch Order</h1>
      <div className='card overflow-x-auto p-md-5 p-1'>
        <h2 className='mb-2 text-lg'>Lunch Items</h2>
        <table className='min-w-full'>
          <thead className='border-b'>
            <tr>
              <th className='px-5 text-left'>Name</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div>
          <DnDCalendar
            defaultDate={moment().toDate()}
            defaultView='month'
            events={eventsState}
            views={{
              week_custom: Week,
              month: true,
              year: Year,
              agenda: true,
            }}
            step={1}
            showMultiDayTimes={false}
            draggableAccessor='isDraggable'
            eventPropGetter={eventPropGetter}
            localizer={localizer}
            onDropFromOutside={onDropFromOutside}
            onDragOver={customOnDragOver}
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            onSelectSlot={newEvent}
            resizable
            style={{ height: "100vh" }}
            messages={{ week_custom: "Week", year: "Year" }}
          />
        </div>
      </div>
      <button
        disabled={loading}
        onClick={submitHandler}
        className='primary-button w-full'
      >
        {loading ? "Loading..." : "Create New Pupil"}
      </button>
    </Layout>
  )
}

RegisterLunchScreen.auth = true
