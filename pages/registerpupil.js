import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import React, { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import Layout from "../components/Layout"
import { getError } from "../utils/error"

export default function RegisterPupilScreen() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const registerPupilHandler = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post("/api/pupils", {
        name: "egg",
      })
      setLoading(false)
      router.push(`/pupil/${data._id}`)
    } catch (err) {
      setLoading(false)
      toast.error(getError(err))
    }
  }

  return (
    <Layout title='Create New Pupil'>
      <h1 className='mb-4 text-xl'>Create New Pupil</h1>

      <div className='grid md:grid-cols-4 md:gap-5'>
        <div className='overflow-x-auto md:col-span-3'>
          <div className='card overflow-x-auto p-5'>
            <h2 className='mb-2 text-lg'>Pupil Items</h2>
            <table className='min-w-full'>
              <thead className='border-b'>
                <tr>
                  <th className='px-5 text-left'>Name</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div>
              <Link href='/cart'>Edit</Link>
            </div>
          </div>
        </div>
        <div>
          <div className='card  p-5'>
            <ul>
              <li>
                <button
                  disabled={loading}
                  onClick={registerPupilHandler}
                  className='primary-button w-full'
                >
                  {loading ? "Loading..." : "Create New Pupil"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

RegisterPupilScreen.auth = true
