import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"



function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

    // console.log('signup form data - ', formData);
  };

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const nameRegex = /^[A-Za-z]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!nameRegex.test(firstName.trim())) {
      newErrors.firstName = true;
      toast.error("First name must be letters only (min 2 characters).");
    }
    if (!nameRegex.test(lastName.trim())) {
      newErrors.lastName = true;
      toast.error("Last name must be letters only (min 2 characters).");
    }
    if (!emailRegex.test(email.trim())) {
      newErrors.email = true;
      toast.error("Please enter a valid email address.");
    }
    if (!passwordRegex.test(password)) {
      newErrors.password = true;
      toast.error("Password must be 8+ chars with at least 1 number and 1 special character.");
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      toast.error("Passwords do not match.");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const signupData = { ...formData, accountType };
    dispatch(setSignupData(signupData));
    dispatch(sendOtp(formData.email, navigate));

    setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  return (
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex gap-x-4">
          {/* First Name */}
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              style={{ boxShadow: errors.firstName ? "inset 0px -1px 0px #EF4444" : "inset 0px -1px 0px rgba(255, 255, 255, 0.18)" }}
              className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none border ${errors.firstName ? 'border-red-500' : 'border-transparent'}`}
            />
          </label>

          {/* Last Name */}
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              style={{ boxShadow: errors.lastName ? "inset 0px -1px 0px #EF4444" : "inset 0px -1px 0px rgba(255, 255, 255, 0.18)" }}
              className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none border ${errors.lastName ? 'border-red-500' : 'border-transparent'}`}
            />
          </label>
        </div>

        {/* Email Address */}
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            style={{ boxShadow: errors.email ? "inset 0px -1px 0px #EF4444" : "inset 0px -1px 0px rgba(255, 255, 255, 0.18)" }}
            className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 outline-none border ${errors.email ? 'border-red-500' : 'border-transparent'}`}
          />
        </label>


        <div className="flex gap-x-4">
          {/* Create Password */}
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Min 8 chars, 1 number, 1 symbol"
              style={{ boxShadow: errors.password ? "inset 0px -1px 0px #EF4444" : "inset 0px -1px 0px rgba(255, 255, 255, 0.18)" }}
              className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 outline-none border ${errors.password ? 'border-red-500' : 'border-transparent'}`}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          {/* Confirm Password  */}
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              style={{ boxShadow: errors.confirmPassword ? "inset 0px -1px 0px #EF4444" : "inset 0px -1px 0px rgba(255, 255, 255, 0.18)" }}
              className={`w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 outline-none border ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>


        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupForm