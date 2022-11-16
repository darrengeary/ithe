import "../styles/globals.css"
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import "bootstrap/dist/css/bootstrap.css"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth adminOnly={Component.auth.adminOnly}>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  )
}

function Auth({ children, adminOnly }) {
  const router = useRouter()
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required")
    },
  })
  if (status === "loading") {
    return <div>Loading...</div>
  }
  if (adminOnly && !session.user.isCaterer) {
    router.push("/unauthorized?message=admin login required")
  }

  return children
}

export default MyApp
