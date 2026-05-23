import NewProject from '@/components/Shared/NewProject'
import { auth } from '@/lib/auth'
import { headers } from "next/headers"

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const isAuthenticated = Boolean(session)

  return (
    <div>
      <NewProject isAuthenticated={isAuthenticated}/>
    </div>
  )
}

export default page