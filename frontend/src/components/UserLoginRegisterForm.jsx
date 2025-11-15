import React, { useContext, useState } from "react";
import "../stylesheets/UserLoginRegisterForm.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MessageContext } from "../context/MessageContext";
import { requestUserLogin, requestUserRegister, requestVerifyEmail } from "../api/userAPI";
import OtpInput from "react-otp-input";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const UserLoginRegisterForm = () => {

  let navigate = useNavigate()

  let { fetchUserProfile } = useContext(UserContext)

  const [openLoginForm, setOpenLoginForm] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [openEmailVerifyForm, setOpenEmailVerifyForm] = useState(false);

  const { triggreMessage } = useContext(MessageContext);

  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(0)

  const [registerFormObject, setRegisterFormObject] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [emailOtpObject, setEmailOtpObject] = useState({
    email: "",
    otp: ""
  })

  const [loginFormObject, setLoginFormObject] = useState({
    email: "",
    password: ""
  })

  const handleLoginFormChange = (e) => {
    let { name, value } = e.target
    setLoginFormObject(prev => {
      return { ...prev, [name]: value }
    })
  }

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      let result = await requestUserLogin(loginFormObject)

      if (result.status != 202) throw ("Login Failed !")

      setLoginFormObject({ email: "", password: "" })

      localStorage.setItem("token", result.data.token)

      triggreMessage("success", result.data.message ? result.data.message : "Login was successfull ! Redirecting to Dashboard.")

      await fetchUserProfile()

      navigate('/user/dashboard')

    } catch (err) {
      console.log("user login failed : ", err)
      setLoginFormObject({ email: "", password: "" })
      triggreMessage("danger", err.response.data.err ? err.response.data.err : err)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterFormChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormObject((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await requestUserRegister(registerFormObject);
      if (result.status !== 202) throw "unable to register user !";

      triggreMessage("success", result.data?.message || "Register User Successfully !", true);

      setEmailOtpObject(prev => {
        return { ...prev, email: registerFormObject.email }
      })

      setRegisterFormObject({
        name: "",
        phone: "",
        email: "",
        password: "",
        dob: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });

      setOpenEmailVerifyForm(true);
    } catch (err) {
      console.log("register new user error : ", err);
      triggreMessage("danger", err.message || err, true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerifyFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        email: emailOtpObject.email,
        otp: otp
      };

      const result = await requestVerifyEmail(payload);

      if (result.status !== 202) throw "Unable to verify OTP!";

      triggreMessage("success", result.data.message || "OTP verified successfully!", true);

      setOpenEmailVerifyForm(false);

      setEmailOtpObject({ email: "", otp: "" });

      setOpenLoginForm(true);

    } catch (err) {
      console.log("verify otp error:", err);
      triggreMessage("danger", err.message || err, true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-register-form">
      <div className="content">
        <div className="login-register-section shadow-lg rounded overflow-hidden">

          {/* register container */}
          <div className="register">
            {!openEmailVerifyForm ? (
              <form onSubmit={handleRegisterFormSubmit} className="h-full flex flex-col justify-center p-5 gap-3">
                <h1 className="text-2xl font-bold">
                  Create New <span className="text-primary opacity-70">Account</span>
                </h1>

                {/* name + phone */}
                <div className="flex gap-3">
                  <div className="grow">
                    <span className="opacity-70">Name</span>
                    <input
                      type="text"
                      name="name"
                      value={registerFormObject.name}
                      onChange={handleRegisterFormChange}
                      className="mt-2 bg-white border border-gray-300 text-dark   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter Your Name"
                    />
                  </div>

                  <div className="grow">
                    <span className="opacity-70">Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      value={registerFormObject.phone}
                      onChange={handleRegisterFormChange}
                      className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                </div>

                {/* dob + email */}
                <div className="flex gap-3">
                  <div>
                    <span className="opacity-70">D.O.B</span>
                    <input
                      type="date"
                      name="dob"
                      value={registerFormObject.dob}
                      onChange={handleRegisterFormChange}
                      className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>

                  <div className="grow">
                    <span className="opacity-70">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={registerFormObject.email}
                      onChange={handleRegisterFormChange}
                      className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter Your Email"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <span className="opacity-70">Address</span>

                  <div className="address-fields w-full flex flex-col gap-3">
                    <input
                      type="text"
                      name="street"
                      value={registerFormObject.street}
                      onChange={handleRegisterFormChange}
                      className="grow mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Street"
                      required
                    />

                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="city"
                        value={registerFormObject.city}
                        onChange={handleRegisterFormChange}
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="City"
                        required
                      />

                      <input
                        type="text"
                        name="state"
                        value={registerFormObject.state}
                        onChange={handleRegisterFormChange}
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="State"
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="country"
                        value={registerFormObject.country}
                        onChange={handleRegisterFormChange}
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Country"
                        required
                      />

                      <input
                        type="number"
                        name="pincode"
                        value={registerFormObject.pincode}
                        onChange={handleRegisterFormChange}
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Pincode"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between opacity-70">
                    <span>Create Password</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={registerFormObject.password}
                      onChange={handleRegisterFormChange}
                      className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Please Enter Password"
                      required
                    />

                    <button type="button"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
                    </button>
                  </div>
                </div>

                {/* Register & Login buttons */}
                <div className="flex gap-3 flex-col justify-center">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-light font-bold px-6 py-2 rounded transition-all"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Register"}
                  </button>

                  <hr />

                  <button
                    type="button"
                    onClick={() => setOpenLoginForm(true)}
                    className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded transition-all"
                  >
                    Already Registered? Please Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEmailVerifyFormSubmit} className='h-full flex flex-col justify-center items-center p-5 gap-3'>
                <h1 className='text-2xl font-bold'>Verify <span className='text-primary'>Email</span></h1>
                <span className='text-center'>An otp has been sent on email <span className='text-primary'>{emailOtpObject.email}</span></span>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  renderSeparator={<span className='mx-2'>-</span>}
                  isInputNum={true}
                  shouldAutoFocus={true}
                  inputStyle={{
                    border: "1px solid black",
                    borderRadius: "8px",
                    width: "54px",
                    height: "54px",
                    fontSize: "12px",
                    color: "#000",
                    fontWeight: "400",
                    caretColor: "blue"
                  }}
                  focusStyle={{
                    border: "1px solid #CFD3DB",
                    outline: "none"
                  }}
                  renderInput={(props) => <input {...props} />}
                />
                <button type='submit' className={`${loading ? "bg-gray-800 hover:bg-gray-800" : "bg-green-600"} hover:bg-green-700 text-light font-bold px-6 py-2 rounded transition-all`} disabled={loading}>
                  {loading ? "Processing..." : "Verify OTP"}
                </button>
              </form>
            )}
          </div>

          {/* login container */}
          <div className="login">
            <form onSubmit={handleLoginFormSubmit} className="h-full flex flex-col justify-center p-5 gap-7">
              <h1 className="text-2xl font-bold">Login</h1>

              <div>
                <span className="opacity-70">Email</span>
                <input
                  type="email"
                  name="email"
                  value={loginFormObject.email}
                  onChange={handleLoginFormChange}
                  className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Please Enter Email"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between opacity-70">
                  <span>Password</span>
                  <span className="text-primary">Forgot Password ?</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginFormObject.password}
                    onChange={handleLoginFormChange}
                    className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Please Enter Password"
                    required
                  />

                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 flex-col justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-light font-bold px-6 py-2 rounded transition-all">
                  Login
                </button>

                <hr />

                <button
                  type="button"
                  onClick={() => setOpenLoginForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded transition-all"
                >
                  New Here? Please Register
                </button>
              </div>
            </form>
          </div>

          {/* Slider */}
          <div className={`slider ${openLoginForm ? "login" : "register"}`}>
            <div className="text-data h-full flex flex-col justify-end gap-2 text-light p-6">
              <span className="font-bold text-2xl">Welcome</span>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.?</p>
              <span className="bg-primary p-2 font-bold w-fit rounded">Get 20% Off</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserLoginRegisterForm;
