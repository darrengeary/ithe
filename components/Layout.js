import { signOut, useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import React, { useContext, useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import { Menu } from "@headlessui/react"
import "react-toastify/dist/ReactToastify.css"
import { Spin as Hamburger } from "hamburger-react"

export default function Layout({ title, children }) {
  const { status, data: session } = useSession()

  const logoutClickHandler = () => {
    signOut({ callbackUrl: "/login" })
  }
  return (
    <>
      <Head>
        <title>{title ? title + " - Ithe" : "Ithe"}</title>
        <meta name='description' content='Lunch Ordering App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ToastContainer position='bottom-center' limit={1} />

      <div className='flex min-h-screen flex-col justify-between '>
        <header>
          <nav className='bg-green d-flex flex-row header flex items-center px-md-5 justify-between shadow-md'>
            {session?.user ? (
              <Menu as='div' className='relative top-0 hamburger inline-block'>
                <Menu.Button>
                  <Hamburger color='#212529' rounded size={18} />
                </Menu.Button>

                <Menu.Items className='absolute left-0 w-56 origin-top-right bg-white  shadow-lg '>
                  {!session.user.isCaterer ? (
                    <>
                      <Menu.Item>
                        <a href='/registerpupil' className='dropdown-link'>
                          Register Pupil
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href='/registerlunch' className='dropdown-link'>
                          Order/View Lunches
                        </a>
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      <Menu.Item>
                        <a href='/registerpupil' className='dropdown-link'>
                          Caterer
                        </a>
                      </Menu.Item>
                    </>
                  )}
                  <Menu.Item>
                    <a
                      className='dropdown-link'
                      href='#'
                      onClick={logoutClickHandler}
                    >
                      Logout
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <></>
            )}

            <Link href='/'>
              <img className='logo' src='/images/logo.png'></img>
            </Link>
            <div className='head-text'>
              <p>Parent / Guardian Portal</p>
            </div>
          </nav>
        </header>
        <main className='carbon container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex h-10 justify-center items-center shadow-inner'>
          <p>Copyright © 2022 Ithe</p>
        </footer>
      </div>
    </>
  )
}
