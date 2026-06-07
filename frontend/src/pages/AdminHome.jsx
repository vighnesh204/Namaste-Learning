import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { getAdminDashboardStats } from '../services/operations/adminApi'
import Footer from '../components/common/Footer'
import Img from '../components/common/Img'

import {
    HiOutlineUsers,
    HiOutlineAcademicCap,
    HiOutlineBookOpen,
    HiOutlineCurrencyRupee,
    HiOutlineCheckCircle,
    HiOutlineShieldCheck,
} from 'react-icons/hi'
import { FiTrendingUp, FiSettings } from 'react-icons/fi'
import { MdOutlineVerifiedUser } from 'react-icons/md'
import { fadeIn } from '../components/common/motionFrameVarients'


// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, sublabel, color }) => (
    <motion.div
        variants={fadeIn('up', 0.1)}
        initial='hidden'
        animate='show'
        className="flex items-center gap-4 rounded-2xl border border-richblack-700 bg-richblack-800 p-5"
    >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon className="text-xl text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-richblack-5">{value ?? '—'}</p>
            <p className="text-sm text-richblack-400">{label}</p>
            {sublabel && <p className="text-xs text-richblack-500 mt-0.5">{sublabel}</p>}
        </div>
    </motion.div>
)

// ─── Skeleton ───────────────────────────────────────────────────────────────
const CardSkeleton = () => (
    <div className="flex items-center gap-4 rounded-2xl border border-richblack-700 bg-richblack-800 p-5">
        <div className="h-12 w-12 rounded-xl skeleton shrink-0" />
        <div className="flex flex-col gap-2">
            <div className="h-6 w-16 rounded-lg skeleton" />
            <div className="h-3 w-28 rounded-lg skeleton" />
        </div>
    </div>
)


// ─── Quick Action Button ─────────────────────────────────────────────────────
const ActionBtn = ({ label, path, color, icon: Icon, navigate }) => (
    <button
        onClick={() => navigate(path)}
        className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] ${color}`}
    >
        {Icon && <Icon className="text-lg" />}
        {label}
    </button>
)


// ─── Main ────────────────────────────────────────────────────────────────────
const AdminHome = () => {
    const { token } = useSelector(state => state.auth)
    const { user } = useSelector(state => state.profile)
    const navigate = useNavigate()

    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            const data = await getAdminDashboardStats(token)
            setStats(data)
            setLoading(false)
        }
        fetchStats()
    }, [token])

    const statCards = [
        { icon: HiOutlineUsers, value: stats?.studentsCount, label: 'Total Students', sublabel: 'Registered learners', color: 'bg-blue-600' },
        { icon: HiOutlineAcademicCap, value: stats?.instructorsCount, label: 'Instructors', sublabel: 'Course creators', color: 'bg-violet-600' },
        { icon: HiOutlineBookOpen, value: stats?.totalCourses, label: 'Total Courses', sublabel: `${stats?.publishedCourses ?? 0} published`, color: 'bg-yellow-600' },
        {
            icon: HiOutlineCurrencyRupee,
            value: stats?.totalRevenue != null ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '—',
            label: 'Total Revenue', sublabel: 'All enrollments', color: 'bg-emerald-600'
        },
        { icon: HiOutlineCheckCircle, value: stats?.publishedCourses, label: 'Published Courses', sublabel: 'Live to students', color: 'bg-pink-600' },
        { icon: HiOutlineShieldCheck, value: stats?.totalUsers, label: 'Total Users', sublabel: 'All roles', color: 'bg-orange-600' },
    ]

    const quickActions = [
        { label: 'Manage Students', path: '/dashboard/all-students', color: 'bg-blue-600 hover:bg-blue-700', icon: HiOutlineUsers },
        { label: 'Manage Instructors', path: '/dashboard/all-instructors', color: 'bg-violet-600 hover:bg-violet-700', icon: HiOutlineAcademicCap },
        { label: 'Manage Courses', path: '/dashboard/admin-courses', color: 'bg-yellow-600 hover:bg-yellow-700', icon: HiOutlineBookOpen },
        { label: 'Categories', path: '/dashboard/create-category', color: 'bg-emerald-600 hover:bg-emerald-700', icon: FiSettings },
        { label: 'Full Dashboard', path: '/dashboard/admin', color: 'bg-richblack-600 hover:bg-richblack-500', icon: FiTrendingUp },
    ]

    return (
        <div className="bg-richblack-900 min-h-screen text-white">
            {/* ── Hero ─────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-richblack-800 via-richblack-900 to-richblack-800 border-b border-richblack-700 pt-24 pb-12 px-4">
                <div className="mx-auto max-w-maxContent">
                    <motion.div
                        variants={fadeIn('down', 0.1)}
                        initial='hidden'
                        animate='show'
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <MdOutlineVerifiedUser className="text-yellow-400 text-xl" />
                            <span className="text-richblack-300 text-sm">Administrator</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-richblack-5 mb-2">
                            Welcome, {user?.firstName} 👋
                        </h1>
                        <p className="text-richblack-400 text-sm">
                            Platform overview — all key metrics at a glance.
                        </p>
                    </motion.div>

                    {/* Stats grid */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {loading
                            ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
                            : statCards.map((card, i) => <StatCard key={i} {...card} />)
                        }
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-maxContent px-4 py-12 space-y-12">

                {/* ── Quick Actions ────────────────────────────────────── */}
                <section>
                    <h2 className="text-xl font-semibold text-richblack-5 mb-5">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                        {quickActions.map(a => (
                            <ActionBtn key={a.path} {...a} navigate={navigate} />
                        ))}
                    </div>
                </section>

                {/* ── Two-column: Top Courses + Recent Users ───────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Top Courses */}
                    <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <FiTrendingUp className="text-yellow-400 text-xl" />
                            <h2 className="text-lg font-semibold text-richblack-5">
                                Top Courses by Enrollment
                            </h2>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-12 w-full rounded-xl skeleton" />
                                ))}
                            </div>
                        ) : stats?.topCourses?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.topCourses.map((course, i) => (
                                    <div
                                        key={course._id}
                                        className="flex items-center gap-3 rounded-xl bg-richblack-700 px-4 py-3 cursor-pointer hover:bg-richblack-600 transition-colors"
                                        onClick={() => navigate('/dashboard/admin-courses')}
                                    >
                                        <span className="text-richblack-400 font-mono text-sm w-5">{i + 1}</span>
                                        <Img
                                            src={course.thumbnail}
                                            alt={course.courseName}
                                            className="h-9 w-14 rounded-lg object-cover shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-richblack-5 text-sm font-medium truncate">{course.courseName}</p>
                                            <p className="text-richblack-400 text-xs">
                                                {course.instructor?.firstName} {course.instructor?.lastName}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-yellow-400 text-sm font-semibold">{course.studentsEnrolled}</p>
                                            <p className="text-richblack-500 text-xs">₹{course.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-richblack-400 text-sm">No courses yet.</p>
                        )}
                    </div>

                    {/* Recent Users */}
                    <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <HiOutlineUsers className="text-blue-400 text-xl" />
                            <h2 className="text-lg font-semibold text-richblack-5">
                                Recently Joined Users
                            </h2>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-12 w-full rounded-xl skeleton" />
                                ))}
                            </div>
                        ) : stats?.recentUsers?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentUsers.map(u => (
                                    <div key={u._id} className="flex items-center gap-3 rounded-xl bg-richblack-700 px-4 py-3">
                                        <Img
                                            src={u.image}
                                            alt={u.firstName}
                                            className="h-9 w-9 rounded-full object-cover shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-richblack-5 text-sm font-medium truncate">
                                                {u.firstName} {u.lastName}
                                            </p>
                                            <p className="text-richblack-400 text-xs truncate">{u.email}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium
                                            ${u.accountType === 'Admin' ? 'bg-pink-900 text-pink-300'
                                            : u.accountType === 'Instructor' ? 'bg-violet-900 text-violet-300'
                                            : 'bg-blue-900 text-blue-300'}`}
                                        >
                                            {u.accountType}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-richblack-400 text-sm">No users yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default AdminHome
