import toast from 'react-hot-toast';
import { apiConnector } from "../apiConnector";
import { adminEndPoints } from '../apis';

const {
    GET_ALL_STUDENTS_DATA_API,
    GET_ALL_INSTRUCTORS_DATA_API,
    ADMIN_DASHBOARD_STATS_API,
    ADMIN_GET_ALL_COURSES_API,
    ADMIN_DELETE_USER_API,
    ADMIN_TOGGLE_USER_STATUS_API,
    ADMIN_DELETE_COURSE_API,
} = adminEndPoints;


// ================ Get All Students ================
export async function getAllStudentsData(token) {
    let result = [];
    try {
        const response = await apiConnector("GET", GET_ALL_STUDENTS_DATA_API, null, {
            Authorization: `Bearer ${token}`,
        });
        result = response?.data;
    } catch (error) {
        console.log("GET_ALL_STUDENTS_DATA_API ERROR:", error);
        toast.error("Could not fetch students data");
    }
    return result;
}


// ================ Get All Instructors ================
export async function getAllInstructorDetails(token) {
    let result = [];
    try {
        const response = await apiConnector("GET", GET_ALL_INSTRUCTORS_DATA_API, null, {
            Authorization: `Bearer ${token}`,
        });
        result = response?.data;
    } catch (error) {
        console.log("GET_ALL_INSTRUCTORS_DATA_API ERROR:", error);
        toast.error("Could not fetch instructors data");
    }
    return result;
}


// ================ Get Admin Dashboard Stats ================
export async function getAdminDashboardStats(token) {
    let result = null;
    try {
        const response = await apiConnector("GET", ADMIN_DASHBOARD_STATS_API, null, {
            Authorization: `Bearer ${token}`,
        });
        if (response?.data?.success) {
            result = response.data.data;
        }
    } catch (error) {
        console.log("ADMIN_DASHBOARD_STATS_API ERROR:", error);
        toast.error("Could not fetch dashboard stats");
    }
    return result;
}


// ================ Get All Courses (Admin) ================
export async function getAllCoursesAdmin(token) {
    let result = [];
    try {
        const response = await apiConnector("GET", ADMIN_GET_ALL_COURSES_API, null, {
            Authorization: `Bearer ${token}`,
        });
        if (response?.data?.success) {
            result = response.data.data;
        }
    } catch (error) {
        console.log("ADMIN_GET_ALL_COURSES_API ERROR:", error);
        toast.error("Could not fetch courses");
    }
    return result;
}


// ================ Delete User (Admin) ================
export async function deleteUserByAdmin(userId, token) {
    const toastId = toast.loading("Deleting user...");
    let success = false;
    try {
        const response = await apiConnector("DELETE", ADMIN_DELETE_USER_API,
            { userId },
            { Authorization: `Bearer ${token}` }
        );
        if (response?.data?.success) {
            toast.success("User deleted successfully");
            success = true;
        } else {
            toast.error(response?.data?.message || "Failed to delete user");
        }
    } catch (error) {
        console.log("ADMIN_DELETE_USER_API ERROR:", error);
        toast.error(error?.response?.data?.message || "Could not delete user");
    }
    toast.dismiss(toastId);
    return success;
}


// ================ Toggle User Ban Status (Admin) ================
export async function toggleUserStatus(userId, token) {
    const toastId = toast.loading("Updating user status...");
    let result = null;
    try {
        const response = await apiConnector("PATCH", ADMIN_TOGGLE_USER_STATUS_API,
            { userId },
            { Authorization: `Bearer ${token}` }
        );
        if (response?.data?.success) {
            toast.success(response.data.message);
            result = response.data.active;
        } else {
            toast.error(response?.data?.message || "Failed to update status");
        }
    } catch (error) {
        console.log("ADMIN_TOGGLE_USER_STATUS_API ERROR:", error);
        toast.error("Could not update user status");
    }
    toast.dismiss(toastId);
    return result;
}


// ================ Delete Course (Admin) ================
export async function deleteCourseByAdmin(courseId, token) {
    const toastId = toast.loading("Deleting course...");
    let success = false;
    try {
        const response = await apiConnector("DELETE", ADMIN_DELETE_COURSE_API,
            { courseId },
            { Authorization: `Bearer ${token}` }
        );
        if (response?.data?.success) {
            toast.success("Course deleted successfully");
            success = true;
        } else {
            toast.error(response?.data?.message || "Failed to delete course");
        }
    } catch (error) {
        console.log("ADMIN_DELETE_COURSE_API ERROR:", error);
        toast.error("Could not delete course");
    }
    toast.dismiss(toastId);
    return success;
}
