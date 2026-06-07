const express = require("express");
const router = express.Router();

const { auth, isInstructor, isAdmin } = require("../middleware/auth");

// controllers
const {
    updateProfile,
    updateUserProfileImage,
    getUserDetails,
    getEnrolledCourses,
    deleteAccount,
    instructorDashboard,
    adminDashboardStats,
    getAllCoursesAdmin,
    deleteUserByAdmin,
    toggleUserStatus,
    deleteCourseByAdmin,
} = require('../controllers/profile');


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete('/deleteProfile', auth, deleteAccount);
router.put('/updateProfile', auth, updateProfile);
router.get('/getUserDetails', auth, getUserDetails);

// Get Enrolled Courses
router.get('/getEnrolledCourses', auth, getEnrolledCourses);

// update profile image
router.put('/updateUserProfileImage', auth, updateUserProfileImage);

// instructor Dashboard Details
router.get('/instructorDashboard', auth, isInstructor, instructorDashboard);


// ********************************************************************************************************
//                                      Admin-only routes
// ********************************************************************************************************

// Admin overview stats
router.get('/admin/dashboard-stats', auth, isAdmin, adminDashboardStats);

// Admin: get all courses with full detail
router.get('/admin/all-courses', auth, isAdmin, getAllCoursesAdmin);

// Admin: delete any user
router.delete('/admin/delete-user', auth, isAdmin, deleteUserByAdmin);

// Admin: ban / unban any user
router.patch('/admin/toggle-user-status', auth, isAdmin, toggleUserStatus);

// Admin: delete any course
router.delete('/admin/delete-course', auth, isAdmin, deleteCourseByAdmin);


module.exports = router;
