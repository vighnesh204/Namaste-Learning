import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProgressBar from '@ramonak/react-progress-bar'

import { getUserEnrolledCourses } from '../services/operations/profileAPI'
import { getAllCourses } from '../services/operations/courseDetailsAPI'
import Course_Slider from '../components/core/Catalog/Course_Slider'
import ReviewSlider from '../components/common/ReviewSlider'
import Footer from '../components/common/Footer'
import Img from '../components/common/Img'

import { HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlineFire } from 'react-icons/hi'
import { FaArrowRight } from 'react-icons/fa'
import { MdOutlineRateReview, MdPlayCircleOutline } from 'react-icons/md'
import { fadeIn } from '../components/common/motionFrameVarients'


// ─── Skeleton ─────────────────────────────────────────────────────────────────
const CourseSkeleton = () => (
    <div className="flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-4">
        <div className="h-14 w-20 rounded-lg skeleton shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-48 rounded-lg skeleton" />
            <div className="h-3 w-32 rounded-lg skeleton" />
            <div className="h-2 w-full rounded-full skeleton mt-1" />
        </div>
    </div>
)

const StatCard = ({ icon: Icon, value, label, color }) => (
    <motion.div
        variants={fadeIn('up', 0.1)}
        initial='hidden'
        animate='show'
        className={`flex items-center gap-4 rounded-2xl border border-richblack-700 bg-richblack-800 p-5`}
    >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon className="text-xl text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-richblack-5">{value}</p>
            <p className="text-sm text-richblack-400">{label}</p>
        </div>
    </motion.div>
)


// ─── Main ──────────────────────────────────────────────────────────────────────
const StudentHome = () => {
    const { token } = useSelector(state => state.auth)
    const { user } = useSelector(state => state.profile)
    const navigate = useNavigate()

    const [enrolledCourses, setEnrolledCourses] = useState(null)
    const [recommendedCourses, setRecommendedCourses] = useState([])
    const [loadingEnrolled, setLoadingEnrolled] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoadingEnrolled(true)
            try {
                const enrolled = await getUserEnrolledCourses(token)
                setEnrolledCourses(enrolled || [])
            } catch {
                setEnrolledCourses([])
            }
            setLoadingEnrolled(false)
        }
        fetchData()
    }, [token])

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const all = await getAllCourses()
                if (all?.length) {
                    setRecommendedCourses(all.slice(0, 6))
                }
            } catch { /* silent */ }
        }
        fetchRecommended()
    }, [])

    const completedCourses = enrolledCourses?.filter(c => c.progressPercentage === 100).length ?? 0
    const inProgressCourses = enrolledCourses?.filter(c => (c.progressPercentage ?? 0) < 100).length ?? 0

    // Pick an in-progress course to highlight
    const continueWatching = enrolledCourses?.find(c => (c.progressPercentage ?? 0) > 0 && c.progressPercentage < 100)
        ?? enrolledCourses?.[0]

    return (
        <div className="bg-richblack-900 min-h-screen text-white">
            {/* ── Hero ───────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-richblack-800 via-richblack-900 to-richblack-800 border-b border-richblack-700 pt-24 pb-12 px-4">
                <div className="mx-auto max-w-maxContent">
                    <motion.div
                        variants={fadeIn('down', 0.1)}
                        initial='hidden'
                        animate='show'
                    >
                        <p className="text-richblack-300 text-sm mb-1">Welcome back,</p>
                        <h1 className="text-3xl lg:text-4xl font-bold text-richblack-5 mb-2">
                            {user?.firstName} {user?.lastName} 👋
                        </h1>
                        <p className="text-richblack-400 text-sm">
                            Continue your learning journey where you left off.
                        </p>
                    </motion.div>

                    {/* Stats row */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard
                            icon={HiOutlineBookOpen}
                            value={enrolledCourses?.length ?? '—'}
                            label="Enrolled Courses"
                            color="bg-blue-600"
                        />
                        <StatCard
                            icon={HiOutlineFire}
                            value={inProgressCourses}
                            label="In Progress"
                            color="bg-orange-600"
                        />
                        <StatCard
                            icon={HiOutlineAcademicCap}
                            value={completedCourses}
                            label="Completed"
                            color="bg-emerald-600"
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-maxContent px-4 py-12 space-y-14">

                {/* ── Continue Learning ───────────────────────────────────── */}
                {continueWatching && (
                    <section>
                        <h2 className="text-xl font-semibold text-richblack-5 mb-5 flex items-center gap-2">
                            <MdPlayCircleOutline className="text-yellow-400 text-2xl" />
                            Continue Learning
                        </h2>
                        <motion.div
                            variants={fadeIn('up', 0.1)}
                            initial='hidden'
                            animate='show'
                            onClick={() => navigate(
                                `/view-course/${continueWatching._id}/section/${continueWatching.courseContent?.[0]?._id}/sub-section/${continueWatching.courseContent?.[0]?.subSection?.[0]?._id}`
                            )}
                            className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-5 cursor-pointer hover:border-yellow-400 transition-colors group"
                        >
                            <Img
                                src={continueWatching.thumbnail}
                                alt={continueWatching.courseName}
                                className="h-32 w-48 shrink-0 rounded-xl object-cover"
                            />
                            <div className="flex-1 min-w-0 w-full">
                                <p className="text-richblack-5 font-semibold text-lg truncate">
                                    {continueWatching.courseName}
                                </p>
                                <p className="text-richblack-400 text-sm mt-1 line-clamp-2">
                                    {continueWatching.courseDescription}
                                </p>
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-richblack-400 mb-1">
                                        <span>Progress</span>
                                        <span>{continueWatching.progressPercentage ?? 0}%</span>
                                    </div>
                                    <ProgressBar
                                        completed={continueWatching.progressPercentage ?? 0}
                                        height="6px"
                                        isLabelVisible={false}
                                        bgColor="#FFD60A"
                                        baseBgColor="#2C333F"
                                    />
                                </div>
                            </div>
                            <div className="shrink-0">
                                <div className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-richblack-900 group-hover:bg-yellow-300 transition-colors">
                                    Resume <FaArrowRight />
                                </div>
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* ── All Enrolled Courses ────────────────────────────────── */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold text-richblack-5">
                            My Courses ({enrolledCourses?.length ?? 0})
                        </h2>
                        <Link
                            to="/dashboard/enrolled-courses"
                            className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition-colors"
                        >
                            View All →
                        </Link>
                    </div>

                    {loadingEnrolled ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map(i => <CourseSkeleton key={i} />)}
                        </div>
                    ) : enrolledCourses?.length === 0 ? (
                        <div className="rounded-2xl border border-richblack-700 bg-richblack-800 py-14 text-center">
                            <HiOutlineBookOpen className="mx-auto text-5xl text-richblack-500 mb-3" />
                            <p className="text-richblack-400 text-lg font-medium">No courses yet</p>
                            <p className="text-richblack-500 text-sm mt-1">Explore the catalog and enroll in your first course.</p>
                            <Link
                                to="/catalog/web-development"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-300 transition-colors"
                            >
                                Browse Courses <FaArrowRight />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {enrolledCourses.slice(0, 5).map((course, i) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => navigate(
                                        `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                    )}
                                    className="flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-4 cursor-pointer hover:border-yellow-400 transition-colors"
                                >
                                    <Img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="h-14 w-20 shrink-0 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-richblack-5 font-medium truncate">{course.courseName}</p>
                                        <p className="text-richblack-500 text-xs mt-0.5">{course.totalDuration ?? ''}</p>
                                        <div className="mt-2">
                                            <ProgressBar
                                                completed={course.progressPercentage ?? 0}
                                                height="5px"
                                                isLabelVisible={false}
                                                bgColor="#FFD60A"
                                                baseBgColor="#2C333F"
                                            />
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-xs text-richblack-400 font-medium">
                                        {course.progressPercentage ?? 0}%
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Recommended Courses ─────────────────────────────────── */}
                {recommendedCourses.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold text-richblack-5 mb-5">
                            Recommended for You 🔥
                        </h2>
                        <Course_Slider Courses={recommendedCourses} />
                    </section>
                )}

                {/* ── Reviews ─────────────────────────────────────────────── */}
                <section>
                    <h2 className="text-xl font-semibold text-richblack-5 mb-2 flex items-center gap-2">
                        What Others Are Saying <MdOutlineRateReview className="text-yellow-400" />
                    </h2>
                    <ReviewSlider />
                </section>
            </div>

            <Footer />
        </div>
    )
}

export default StudentHome
