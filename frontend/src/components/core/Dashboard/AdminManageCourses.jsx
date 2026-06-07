import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import { getAllCoursesAdmin, deleteCourseByAdmin } from '../../../services/operations/adminApi';
import ConfirmationModal from '../../common/ConfirmationModal';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { HiOutlineSearch } from 'react-icons/hi';
import { MdOutlinePublish } from 'react-icons/md';
import { VscNote } from 'react-icons/vsc';


// ─── Skeleton ─────────────────────────────────────────────────────────────────
const RowSkeleton = () => (
    <div className="flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-4">
        <div className="h-14 w-20 rounded-lg skeleton shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-48 rounded-lg skeleton" />
            <div className="h-3 w-32 rounded-lg skeleton" />
        </div>
        <div className="h-4 w-16 rounded-lg skeleton" />
        <div className="h-4 w-12 rounded-lg skeleton" />
        <div className="h-8 w-8 rounded-lg skeleton" />
    </div>
);


// ─── Main Component ───────────────────────────────────────────────────────────
const AdminManageCourses = () => {
    const { token } = useSelector(state => state.auth);
    const [courses, setCourses] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [confirmModal, setConfirmModal] = useState(null);

    const fetchCourses = async () => {
        setLoading(true);
        const data = await getAllCoursesAdmin(token);
        setCourses(data);
        setFiltered(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, [token]);

    // Filter on search or status change
    useEffect(() => {
        let result = courses;
        if (statusFilter !== 'All') {
            result = result.filter(c => c.status === statusFilter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(c =>
                c.courseName?.toLowerCase().includes(q) ||
                c.instructor?.firstName?.toLowerCase().includes(q) ||
                c.instructor?.lastName?.toLowerCase().includes(q) ||
                c.category?.name?.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, statusFilter, courses]);

    const handleDelete = (courseId, courseName) => {
        setConfirmModal({
            text1: 'Delete this course?',
            text2: `"${courseName}" will be permanently removed along with all its sections and subsections.`,
            btn1Text: 'Delete',
            btn2Text: 'Cancel',
            btn1Handler: async () => {
                const success = await deleteCourseByAdmin(courseId, token);
                if (success) {
                    setCourses(prev => prev.filter(c => c._id !== courseId));
                }
                setConfirmModal(null);
            },
            btn2Handler: () => setConfirmModal(null),
        });
    };

    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo">
                        Manage Courses
                    </h1>
                    <p className="text-richblack-400 text-sm mt-1">
                        {courses.length} total course{courses.length !== 1 ? 's' : ''} on the platform
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search by course name, instructor or category..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-richblack-700 bg-richblack-800 py-2.5 pl-10 pr-4 text-sm text-richblack-5 placeholder:text-richblack-400 outline-none focus:border-yellow-400 transition-colors"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex rounded-xl border border-richblack-700 overflow-hidden shrink-0">
                    {['All', 'Published', 'Draft'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors
                                ${statusFilter === s
                                    ? 'bg-yellow-400 text-richblack-900'
                                    : 'bg-richblack-800 text-richblack-300 hover:bg-richblack-700'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_80px_50px] gap-4 rounded-t-xl border border-b-0 border-richblack-700 bg-richblack-700 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-richblack-300">
                <span>Course</span>
                <span>Instructor</span>
                <span>Category</span>
                <span className="text-center">Price</span>
                <span className="text-center">Action</span>
            </div>

            {/* Course Rows */}
            <div className="flex flex-col gap-0 rounded-b-xl overflow-hidden border border-t-0 border-richblack-700">
                {loading ? (
                    <div className="flex flex-col gap-2 p-4 bg-richblack-800">
                        {Array(6).fill(0).map((_, i) => <RowSkeleton key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-richblack-800 py-16 text-center text-richblack-400">
                        No courses match your filters.
                    </div>
                ) : (
                    filtered.map((course, i) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_80px_50px] gap-4 items-center border-b border-richblack-700 bg-richblack-800 hover:bg-richblack-750 px-5 py-4 last:border-b-0 transition-colors"
                        >
                            {/* Course Info */}
                            <div className="flex items-center gap-3 min-w-0">
                                <img
                                    src={course.thumbnail}
                                    alt={course.courseName}
                                    className="h-12 w-16 rounded-lg object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="text-richblack-5 text-sm font-medium truncate">
                                        {course.courseName}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        {course.status === 'Published' ? (
                                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                                                <MdOutlinePublish /> Published
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs text-richblack-400">
                                                <VscNote /> Draft
                                            </span>
                                        )}
                                        <span className="text-richblack-600 text-xs">·</span>
                                        <span className="text-richblack-400 text-xs">
                                            {course.studentsEnrolled?.length ?? 0} enrolled
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Instructor */}
                            <div className="flex items-center gap-2 min-w-0">
                                <img
                                    src={course.instructor?.image}
                                    alt={course.instructor?.firstName}
                                    className="h-7 w-7 rounded-full object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="text-richblack-200 text-xs truncate">
                                        {course.instructor?.firstName} {course.instructor?.lastName}
                                    </p>
                                    <p className="text-richblack-500 text-xs truncate hidden sm:block">
                                        {course.instructor?.email}
                                    </p>
                                </div>
                            </div>

                            {/* Category */}
                            <span className="text-richblack-300 text-xs">
                                {course.category?.name ?? '—'}
                            </span>

                            {/* Price */}
                            <span className="text-center text-yellow-400 text-sm font-semibold">
                                ₹{course.price?.toLocaleString('en-IN')}
                            </span>

                            {/* Delete */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleDelete(course._id, course.courseName)}
                                    className="rounded-lg p-2 text-richblack-400 hover:bg-pink-900 hover:text-pink-300 transition-colors"
                                    title="Delete course"
                                >
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Results count */}
            {!loading && filtered.length > 0 && (
                <p className="text-richblack-500 text-xs text-right">
                    Showing {filtered.length} of {courses.length} courses
                </p>
            )}

            {confirmModal && <ConfirmationModal modalData={confirmModal} />}
        </div>
    );
};

export default AdminManageCourses;
