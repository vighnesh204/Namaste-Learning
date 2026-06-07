import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import {
    getAllStudentsData,
    deleteUserByAdmin,
    toggleUserStatus,
} from '../../../services/operations/adminApi';
import ConfirmationModal from '../../common/ConfirmationModal';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { HiOutlineSearch, HiOutlineBan } from 'react-icons/hi';
import { MdOutlineVerifiedUser } from 'react-icons/md';
import userLogo from '../../../assets/Images/user.png';


// ─── Skeleton ─────────────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
    <div className="flex flex-col gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-5">
        <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full skeleton shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-40 rounded-lg skeleton" />
                <div className="h-3 w-56 rounded-lg skeleton" />
                <div className="h-3 w-28 rounded-lg skeleton" />
            </div>
            <div className="h-8 w-8 rounded-lg skeleton" />
        </div>
    </div>
);


// ─── Main Component ───────────────────────────────────────────────────────────
const AllStudents = () => {
    const { token } = useSelector(state => state.auth);
    const [allStudents, setAllStudents] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [studentsCount, setStudentsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [confirmModal, setConfirmModal] = useState(null);

    const fetchStudents = async () => {
        setLoading(true);
        const { allStudentsDetails, studentsCount: count } = await getAllStudentsData(token);
        setAllStudents(allStudentsDetails || []);
        setFiltered(allStudentsDetails || []);
        setStudentsCount(count || 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, [token]);

    // Search filter
    useEffect(() => {
        if (!search.trim()) {
            setFiltered(allStudents);
        } else {
            const q = search.toLowerCase();
            setFiltered(allStudents.filter(s =>
                s.firstName?.toLowerCase().includes(q) ||
                s.lastName?.toLowerCase().includes(q) ||
                s.email?.toLowerCase().includes(q)
            ));
        }
    }, [search, allStudents]);

    const handleDelete = (userId, name) => {
        setConfirmModal({
            text1: 'Delete this student?',
            text2: `"${name}" will be permanently removed. This action cannot be undone.`,
            btn1Text: 'Delete',
            btn2Text: 'Cancel',
            btn1Handler: async () => {
                const success = await deleteUserByAdmin(userId, token);
                if (success) {
                    setAllStudents(prev => prev.filter(s => s._id !== userId));
                }
                setConfirmModal(null);
            },
            btn2Handler: () => setConfirmModal(null),
        });
    };

    const handleToggleStatus = async (userId) => {
        const newActive = await toggleUserStatus(userId, token);
        if (newActive !== null) {
            setAllStudents(prev =>
                prev.map(s => s._id === userId ? { ...s, active: newActive } : s)
            );
        }
    };

    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo">
                        All Students
                    </h1>
                    <p className="text-richblack-400 text-sm mt-1">
                        {studentsCount} registered student{studentsCount !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400 text-lg" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-richblack-700 bg-richblack-800 py-2.5 pl-10 pr-4 text-sm text-richblack-5 placeholder:text-richblack-400 outline-none focus:border-yellow-400 transition-colors"
                />
            </div>

            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_160px_120px_100px] gap-4 rounded-t-xl border border-b-0 border-richblack-700 bg-richblack-700 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-richblack-300">
                <span>Student</span>
                <span>Enrolled Courses</span>
                <span className="text-center">Status</span>
                <span className="text-center">Actions</span>
            </div>

            {/* Rows */}
            <div className="flex flex-col rounded-b-xl overflow-hidden border border-t-0 border-richblack-700">
                {loading ? (
                    <div className="flex flex-col gap-2 p-4 bg-richblack-800">
                        {Array(5).fill(0).map((_, i) => <LoadingSkeleton key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-richblack-800 py-16 text-center text-richblack-400">
                        {search ? 'No students match your search.' : 'No students found.'}
                    </div>
                ) : (
                    filtered.map((student, i) => (
                        <motion.div
                            key={student._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="grid grid-cols-1 sm:grid-cols-[1fr_160px_120px_100px] gap-4 items-center border-b border-richblack-700 bg-richblack-800 hover:bg-richblack-750 px-5 py-4 last:border-b-0 transition-colors"
                        >
                            {/* Student Info */}
                            <div className="flex items-center gap-3 min-w-0">
                                <img
                                    src={student.image && student.image !== '/' ? student.image : userLogo}
                                    alt={student.firstName}
                                    className="h-11 w-11 rounded-full object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="text-richblack-5 text-sm font-medium truncate">
                                        {student.firstName} {student.lastName}
                                    </p>
                                    <p className="text-richblack-400 text-xs truncate">
                                        {student.email}
                                    </p>
                                    <div className="flex gap-3 text-xs text-richblack-500 mt-0.5">
                                        {student.additionalDetails?.gender && (
                                            <span>{student.additionalDetails.gender}</span>
                                        )}
                                        {student.additionalDetails?.contactNumber && (
                                            <span>{student.additionalDetails.contactNumber}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Enrolled Courses */}
                            <div>
                                {student.courses?.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {student.courses.slice(0, 3).map(course => (
                                            <span
                                                key={course._id}
                                                className="rounded-full bg-richblack-700 px-2 py-0.5 text-xs text-richblack-200 truncate max-w-[120px]"
                                                title={course.courseName}
                                            >
                                                {course.courseName}
                                            </span>
                                        ))}
                                        {student.courses.length > 3 && (
                                            <span className="rounded-full bg-richblack-700 px-2 py-0.5 text-xs text-richblack-400">
                                                +{student.courses.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-richblack-500 text-xs">None</span>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex justify-center sm:justify-start">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium
                                    ${student.active
                                        ? 'bg-emerald-900 text-emerald-300'
                                        : 'bg-red-900 text-red-300'}`}
                                >
                                    {student.active ? 'Active' : 'Banned'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-2">
                                {/* Ban / Unban */}
                                <button
                                    onClick={() => handleToggleStatus(student._id)}
                                    title={student.active ? 'Ban user' : 'Unban user'}
                                    className={`rounded-lg p-2 transition-colors
                                        ${student.active
                                            ? 'text-richblack-400 hover:bg-orange-900 hover:text-orange-300'
                                            : 'text-richblack-400 hover:bg-emerald-900 hover:text-emerald-300'}`}
                                >
                                    {student.active ? <HiOutlineBan /> : <MdOutlineVerifiedUser />}
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(student._id, `${student.firstName} ${student.lastName}`)}
                                    title="Delete student"
                                    className="rounded-lg p-2 text-richblack-400 hover:bg-pink-900 hover:text-pink-300 transition-colors"
                                >
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Count */}
            {!loading && filtered.length > 0 && (
                <p className="text-richblack-500 text-xs text-right">
                    Showing {filtered.length} of {studentsCount} students
                </p>
            )}

            {confirmModal && <ConfirmationModal modalData={confirmModal} />}
        </div>
    );
};

export default AllStudents;
