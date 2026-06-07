import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { getAdminDashboardStats } from '../../../services/operations/adminApi';

import {
    HiOutlineUsers,
    HiOutlineAcademicCap,
    HiOutlineBookOpen,
    HiOutlineCurrencyRupee,
    HiOutlineCheckCircle,
    HiOutlineClipboardList,
} from 'react-icons/hi';
import { FiTrendingUp } from 'react-icons/fi';


// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-5 rounded-2xl border border-richblack-700 bg-richblack-800 p-6"
    >
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon className="text-2xl text-white" />
        </div>
        <div>
            <p className="text-3xl font-bold text-richblack-5">{value ?? '—'}</p>
            <p className="text-sm font-medium text-richblack-300">{title}</p>
            {subtitle && <p className="text-xs text-richblack-400 mt-0.5">{subtitle}</p>}
        </div>
    </motion.div>
);


// ─── Skeleton ─────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
    <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 flex items-center gap-5">
        <div className="h-14 w-14 rounded-xl skeleton" />
        <div className="flex flex-col gap-2">
            <div className="h-7 w-20 rounded-lg skeleton" />
            <div className="h-4 w-36 rounded-lg skeleton" />
        </div>
    </div>
);


// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const { token } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const data = await getAdminDashboardStats(token);
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, [token]);

    const statCards = [
        {
            title: 'Total Students',
            value: stats?.studentsCount,
            icon: HiOutlineUsers,
            color: 'bg-blue-600',
            subtitle: 'Registered learners',
        },
        {
            title: 'Total Instructors',
            value: stats?.instructorsCount,
            icon: HiOutlineAcademicCap,
            color: 'bg-violet-600',
            subtitle: 'Course creators',
        },
        {
            title: 'Total Courses',
            value: stats?.totalCourses,
            icon: HiOutlineBookOpen,
            color: 'bg-yellow-600',
            subtitle: `${stats?.publishedCourses ?? 0} published · ${stats?.draftCourses ?? 0} draft`,
        },
        {
            title: 'Total Revenue',
            value: stats?.totalRevenue != null
                ? `₹${stats.totalRevenue.toLocaleString('en-IN')}`
                : '—',
            icon: HiOutlineCurrencyRupee,
            color: 'bg-green-600',
            subtitle: 'Across all enrollments',
        },
        {
            title: 'Published Courses',
            value: stats?.publishedCourses,
            icon: HiOutlineCheckCircle,
            color: 'bg-emerald-600',
            subtitle: 'Visible to students',
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers,
            icon: HiOutlineClipboardList,
            color: 'bg-pink-600',
            subtitle: 'All account types',
        },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo">
                    Admin Dashboard
                </h1>
                <p className="mt-1 text-richblack-400 text-sm">
                    Platform-wide overview and key metrics
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {loading
                    ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
                    : statCards.map((card, i) => (
                        <StatCard key={i} {...card} />
                    ))}
            </div>

            {/* Two-column lower section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Courses by Enrollment */}
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
                                    className="flex items-center gap-4 rounded-xl bg-richblack-700 px-4 py-3"
                                >
                                    <span className="text-richblack-400 font-mono text-sm w-5">
                                        {i + 1}
                                    </span>
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="h-10 w-14 rounded-lg object-cover shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-richblack-5 text-sm font-medium truncate">
                                            {course.courseName}
                                        </p>
                                        <p className="text-richblack-400 text-xs">
                                            {course.instructor?.firstName} {course.instructor?.lastName}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-yellow-400 text-sm font-semibold">
                                            {course.studentsEnrolled} students
                                        </p>
                                        <p className="text-richblack-400 text-xs">₹{course.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-richblack-400 text-sm">No courses found.</p>
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
                            {stats.recentUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center gap-4 rounded-xl bg-richblack-700 px-4 py-3"
                                >
                                    <img
                                        src={user.image}
                                        alt={user.firstName}
                                        className="h-9 w-9 rounded-full object-cover shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-richblack-5 text-sm font-medium truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-richblack-400 text-xs truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium
                                        ${user.accountType === 'Admin'
                                            ? 'bg-pink-900 text-pink-300'
                                            : user.accountType === 'Instructor'
                                                ? 'bg-violet-900 text-violet-300'
                                                : 'bg-blue-900 text-blue-300'
                                        }`}>
                                        {user.accountType}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-richblack-400 text-sm">No users found.</p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6">
                <h2 className="text-lg font-semibold text-richblack-5 mb-5">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'Manage Students', path: '/dashboard/all-students', color: 'bg-blue-600 hover:bg-blue-700' },
                        { label: 'Manage Instructors', path: '/dashboard/all-instructors', color: 'bg-violet-600 hover:bg-violet-700' },
                        { label: 'Manage Courses', path: '/dashboard/admin-courses', color: 'bg-yellow-600 hover:bg-yellow-700' },
                        { label: 'Manage Categories', path: '/dashboard/create-category', color: 'bg-green-600 hover:bg-green-700' },
                    ].map((action) => (
                        <button
                            key={action.path}
                            onClick={() => navigate(action.path)}
                            className={`${action.color} rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
