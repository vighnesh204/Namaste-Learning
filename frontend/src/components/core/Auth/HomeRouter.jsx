/**
 * HomeRouter — sits at the "/" route.
 *
 * • Not logged in  → show the public landing page (Home)
 * • Student        → StudentHome
 * • Instructor     → InstructorHome
 * • Admin          → AdminHome
 */
import { useSelector } from 'react-redux'

import Home from '../../../pages/Home'
import StudentHome from '../../../pages/StudentHome'
import InstructorHome from '../../../pages/InstructorHome'
import AdminHome from '../../../pages/AdminHome'
import { ACCOUNT_TYPE } from '../../../utils/constants'

const HomeRouter = () => {
    const { token } = useSelector(state => state.auth)
    const { user } = useSelector(state => state.profile)

    // Not logged in → public landing page
    if (!token) return <Home />

    // Logged in — route by role
    switch (user?.accountType) {
        case ACCOUNT_TYPE.STUDENT:
            return <StudentHome />
        case ACCOUNT_TYPE.INSTRUCTOR:
            return <InstructorHome />
        case ACCOUNT_TYPE.ADMIN:
            return <AdminHome />
        default:
            // Fallback while user object is loading from Redux
            return <Home />
    }
}

export default HomeRouter
