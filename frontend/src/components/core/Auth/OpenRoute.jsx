// Prevents authenticated users from accessing login/signup pages.
// Logged-in users are sent to "/" which HomeRouter will then route by role.
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)

  if (token === null) {
    return children
  } else {
    return <Navigate to="/" />
  }
}

export default OpenRoute
