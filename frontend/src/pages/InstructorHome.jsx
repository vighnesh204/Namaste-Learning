import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { getInstructorData } from '../services/operations/profileAPI'
import { fetchInstructorCourses } from '../services/operations/courseDetailsAPI'
import InstructorChart from '../components/core/Dashboard/InstructorDashboard/InstructorChart'
import Footer from '../components/common/Footer'
import Img from '../components/common/Img'

import {
    HiOutlineUsers,
    HiOutlineCurrencyRupee,
    HiOutlineBookOpen,
    HiOutlinePlusCircle,
} from 'react-icons/hi'
import { MdOutlinePublish } from 'react-icons/md'
import { VscNote } from 'react-icons/vsc'
import { FaArrowRight } from 'react-icons/fa'
import { fadeIn } from '../components/common/motionFrameVarients'


// ─── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, color }) => (
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
        </div>
    </motion.div>
)

// ─── Skeleton ──────────────────────────────────────────────────────────────
const CourseSkeleton = () => (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-richblack-700 bg-richblack-800 p-4">
        <div className="h-36 w-full rounded-xl skeleton" />
        <div className="h-4 w-3/4 rounded-lg skeleton" />
        <div className="h-3 w-1/2 rounded-lg skeleton" />
    </div>
)


// ─── Main ──────────────────────────────────────────────────────────────────
const InstructorHome = () => {
    const { token } = useSelector(state => state.auth)
    const { user } = useSelector(state => state.profile)
    const navigate = useNavigate()

    const [instructorData, setInstructorData] = useState(null)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [apiData, courseList] = await Promise.all([
                    getInstructorData(token),
                    fetchInstructorCourses(token),
                ])
                if (apiData?.length) setInstructorData(apiData)
                if (courseList) setCourses(courseList)
            } catch { /* silent */ }
            setLoading(false)
        }
        fetchData()
    }, [token])

    const totalAmount = instructorData?.reduce((acc, c) => acc + c.totalAmountGenerated, 0) ?? 0
    const totalStudents = instructorData?.reduce((acc, c) => acc + c.totalStudentsEnrolled, 0) ?? 0
    const publishedCount = courses.filter(c => c.status === 'Published').length
    const draftCount = courses.filter(c => c.status === 'Draft').length

    return (
        <div className="bg-richblack-900 min-h-screen text-white">
            {/* ── Hero ──────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-richblack-800 via-richblack-900 to-richblack-800 border-b border-richblack-700 pt-24 pb-12 px-4">
                <div className="mx-auto max-w-maxContent">
                    <motion.div
                        variants={fadeIn('down', 0.1)}
                        initial='hidden'
                        animate='show'
                    >
                        <p className="text-richblack-300 text-sm mb-1">Instructor Dashboard</p>
                        <h1 className="text-3xl lg:text-4xl font-bold text-richblack-5 mb-2">
                            Hi, {user?.firstName} 👋
                        </h1>
                        <p className="text-richblack-400 text-sm">
                            Here's how your courses are performing today.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={HiOutlineBookOpen} value={courses.length} label="Total Courses" color="bg-yellow-600" />
                        <StatCard icon={HiOutlineUsers} value={totalStudents} label="Total Students" color="bg-blue-600" />
                        <StatCard icon={HiOutlineCurrencyRupee} value={`₹${totalAmount.toLocaleString('en-IN')}`} label="Total Revenue" color="bg-emerald-600" />
                        <StatCard icon={MdOutlinePublish} value={publishedCount} label={`Published · ${draftCount} Draft`} color="bg-violet-600" />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-maxContent px-4 py-12 space-y-12">

                {/* ── Quick Actions ──────────────────────────────────────── */}
                <section className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/dashboard/add-course')}
                        className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-300 transition-colors"
                    >
                        <HiOutlinePlusCircle className="text-lg" /> Create New Course
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/my-courses')}
                        className="flex items-center gap-2 rounded-xl border border-richblack-600 bg-richblack-800 px-5 py-2.5 text-sm font-semibold text-richblack-200 hover:border-yellow-400 hover:text-white transition-colors"
                    >
                        View All Courses <FaArrowRight />
                    </button>
                </section>

                {/* ── Chart ─────────────────────────────────────────────── */}
                {!loading && courses.length > 0 && (totalAmount > 0 || totalStudents > 0) && (
                    <section>
                        <h2 className="text-xl font-semibold text-richblack-5 mb-5">
                            Performance Overview
                        </h2>
                        <div className="h-[400px]">
                            <InstructorChart courses={instructorData} />
                        </div>
                    </section>
                )}

                {/* ── Recent Courses ─────────────────────────────────────── */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold text-richblack-5">
                            Your Courses
                        </h2>
                        {courses.length > 3 && (
                            <Link
                                to="/dashboard/my-courses"
                                className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline"
                            >
                                View All →
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3].map(i => <CourseSkeleton key={i} />)}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="rounded-2xl border border-richblack-700 bg-richblack-800 py-16 text-center">
                            <HiOutlineBookOpen className="mx-auto text-5xl text-richblack-500 mb-3" />
                            <p className="text-richblack-400 text-lg font-medium">No courses yet</p>
                            <p className="text-richblack-500 text-sm mt-1">Share your knowledge with the world.</p>
                            <button
                                onClick={() => navigate('/dashboard/add-course')}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-300 transition-colors"
                            >
                                Create Your First Course <FaArrowRight />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {courses.slice(0, 6).map((course, i) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                                    className="group flex flex-col rounded-2xl border border-richblack-700 bg-richblack-800 overflow-hidden cursor-pointer hover:border-yellow-400 transition-colors"
                                >
                                    <div className="relative">
                                        <Img
                                            src={course.thumbnail}
                                            alt={course.courseName}
                                            className="h-40 w-full object-cover"
                                        />
                                        {/* Status badge */}
                                        <span className={`absolute top-2 right-2 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium
                                            ${course.status === 'Published'
                                                ? 'bg-emerald-900/80 text-emerald-300'
                                                : 'bg-richblack-700/80 text-richblack-300'}`}
                                        >
                                            {course.status === 'Published'
                                                ? <><MdOutlinePublish /> Published</>
                                                : <><VscNote /> Draft</>
                                            }
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2 p-4">
                                        <p className="text-richblack-5 font-medium line-clamp-2 text-sm">
                                            {course.courseName}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-richblack-400">
                                            <span>{course.studentsEnrolled?.length ?? 0} students</span>
                                            <span className="text-yellow-400 font-semibold">₹{course.price}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Tips ──────────────────────────────────────────────── */}
                <section className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6">
                    <h2 className="text-lg font-semibold text-richblack-5 mb-4">
                        Quick Tips for Instructors
                    </h2>
                    <ul className="space-y-2 text-sm text-richblack-300 list-disc list-inside">
                        <li>Publish your draft courses to make them visible to students.</li>
                        <li>Add detailed subsections with video links to increase completion rates.</li>
                        <li>Well-structured courses with clear descriptions get more enrollments.</li>
                        <li>Keep course thumbnails crisp — they appear on the homepage sliders.</li>
                    </ul>
                </section>
            </div>

            <Footer />
        </div>
    )
}

export default InstructorHome
