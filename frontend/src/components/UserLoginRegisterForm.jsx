import React, { useContext, useState } from 'react'
import "../stylesheets/UserLoginRegisterForm.scss"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MessageContext } from '../context/MessageContext';
import { requestUserRegister } from '../api/userAPI';

const UserLoginRegisterForm = () => {

  let [openFormLogin, setOpenFormLogin] = useState(true)

  let [showPassword, setShowPassword] = useState(false)

  let [openEmailVerifyForm, setOpenEmailVerifyForm] = useState(true)

  let { triggreMessage } = useContext(MessageContext)

  let [loader, setLoader] = useState(false)

  let [registerFormValue, setRegisterFormValue] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: ""
  })

  const handleLoginFormSubmit = (e) => {
    try {
      e.preventDefault()
      triggreMessage("success", "successfully logedIn ! redirecting to dashboard.", true)
    } catch (err) {
      triggreMessage("danger", "successfully logedIn ! redirecting to dashboard.", true)
    }
  }

  const handleRegisterFormChange = (e) => {
    let { name, value } = e.target
    setRegisterFormValue(prev => {
      return { ...prev, [name]: value }
    })
  }

  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault()
    try {

      setLoader(true)

      let result = await requestUserRegister(registerFormValue)

      if (result.status != 202) {
        throw ("unable to register user !")
      }

      triggreMessage("success", result.data.message ? result.data.message : "Register User Successfully !", true)

      setRegisterFormValue({
        name: "",
        phone: "",
        email: "",
        password: "",
        dob: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: ""
      })

      setOpenEmailVerifyForm(true)

    } catch (err) {
      console.log("register new user error : ", err)
      triggreMessage("danger", err.message ? err.message : err, true)
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className='login-register-form'>
      <div className='content'>
        <div className='login-register-section shadow-lg rounded overflow-hidden'>
          {/* register container */}
          <div className='register'>
            {openEmailVerifyForm == false ?
              <form
                onSubmit={handleRegisterFormSubmit}
                className='h-full flex flex-col justify-center p-5 gap-3'>
                <h1 className='text-2xl font-bold'>Create New
                  <span className='text-primary opacity-70'> Account</span>
                </h1>
                {/* name and phone */}
                <div className='flex gap-3'>
                  {/* name */}
                  <div className='grow'>
                    <div>
                      <span className='opacity-70'>
                        Name
                      </span>
                    </div>
                    <input
                      type="text"
                      id='name'
                      name='name'
                      value={registerFormValue.name}
                      onChange={handleRegisterFormChange}
                      className='mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                      placeholder='Enter Your Name' />
                  </div>
                  {/* phone */}
                  <div className='grow'>
                    <div>
                      <span className='opacity-70'>
                        Phone
                      </span>
                    </div>
                    <input
                      type="tel"
                      id='phone'
                      name='phone'
                      value={registerFormValue.phone}
                      onChange={handleRegisterFormChange}
                      className='mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                      placeholder='Enter Mobile Number' />
                  </div>
                </div>
                {/* dob and emai */}
                <div className='flex gap-3'>
                  {/* dob */}
                  <div>
                    <div>
                      <span className='opacity-70'>D.O.B</span>
                    </div>
                    <input
                      type="date"
                      id='dob'
                      name='dob'
                      value={registerFormValue.dob}
                      onChange={handleRegisterFormChange}
                      className='mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />
                  </div>
                  {/* email */}
                  <div className='grow'>
                    <div>
                      <span className='opacity-70'>Email</span>
                    </div>
                    <input
                      type="email"
                      id='email'
                      name='email'
                      value={registerFormValue.email}
                      onChange={handleRegisterFormChange}
                      className='mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                      placeholder='Enter Your Email' />
                  </div>
                </div>
                {/* address */}
                <div>
                  <div>
                    <span className='opacity-70'>Address</span>
                  </div>
                  {/* address fields */}
                  <div className='address-fields w-full flex flex-col gap-3'>

                    <div className='w-full grow'>
                      <input
                        type="text"
                        id="street"
                        name='street'
                        value={registerFormValue.street}
                        onChange={handleRegisterFormChange}
                        className="grow mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Street"
                        required />
                    </div>

                    <div className='flex gap-3'>
                      <input
                        type="text"
                        id="city"
                        name='city'
                        value={registerFormValue.city}
                        onChange={handleRegisterFormChange}
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="City"
                        required />
                      <input
                        type="text"
                        id="state"
                        name='state'
                        value={registerFormValue.state}
                        onChange={handleRegisterFormChange}
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="State"
                        required />
                    </div>

                    <div className='flex gap-3'>
                      <input
                        type="text"
                        id="country"
                        name='country'
                        value={registerFormValue.country}
                        onChange={handleRegisterFormChange}
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Country"
                        required />
                      <input
                        type="number"
                        id="pincode"
                        name='pincode'
                        value={registerFormValue.pincode}
                        onChange={handleRegisterFormChange}
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Pincode"
                        required />
                    </div>
                  </div>
                </div>
                {/* create password */}
                <div>
                  <div className='flex justify-between opacity-70'>
                    <span>Create Password</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name='password'
                      value={registerFormValue.password}
                      onChange={handleRegisterFormChange}
                      className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Please Enter Password"
                      required />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}>
                      {
                        showPassword ?
                          <FaEyeSlash size={25} /> :
                          <FaEye size={25} />
                      }
                    </button>
                  </div>
                </div>

                {/* login and create account button */}
                <div className='flex gap-3 flex-col justify-center'>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-light font-bold px-6 py-2 rounded transition-all"
                    disabled={loader}>
                    {
                      loader ? "Processing..." : "Register"
                    }
                  </button>
                  <hr />
                  <button
                    type='button'
                    onClick={() => { setOpenFormLogin(true) }}
                    className='bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded transition-all'>
                    Already Registered? Please Login
                  </button>
                </div>
              </form>

              :

              <form className='h-full flex flex-col justify-center p-5 gap-3'>
                <h1 className='text-2xl font-bold'>
                  Verify Your Email
                </h1>
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
                <button type='submit' className={`${loader ? "bg-gray-800 hover:bg-gray-800" : "bg-green-600"} hover:bg-green-700 text-light font-bold px-6 py-2 rounded transition-all`} disabled={loader}>
                  {loader ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            }
          </div>

          {/* login container */}
          <div className='login'>
            <form
              onSubmit={handleLoginFormSubmit}
              className='h-full flex flex-col justify-center p-5 gap-7'>
              <h1 className='text-2xl font-bold'>Login</h1>

              <div>
                <div>
                  <span className='opacity-70'>Email</span>
                </div>
                <input
                  type="email"
                  id="email"
                  className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Please Enter Email"
                  required />
              </div>

              <div>
                <div className='flex justify-between opacity-70'>
                  <span>Password</span>
                  <span className='text-primary'>Forgot Password ?</span>
                </div>
                <div className='flex items-center gap-3'>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Please Enter Password"
                    required />
                  <button type='button' onClick={() => setShowPassword(!showPassword)}>
                    {
                      showPassword ?
                        <FaEyeSlash size={25} /> :
                        <FaEye size={25} />
                    }
                  </button>
                </div>
              </div>

              <div className='flex gap-3 flex-col justify-center'>
                <button className='bg-green-600 hover:bg-green-700 text-light font-bold px-6 py-2 rounded transition-all'>Login</button>
                <hr />
                <button type='button' onClick={() => { setOpenFormLogin(false) }} className='bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded transition-all'>New Here? Please Register</button>
              </div>
            </form>
          </div>

          {/* slider container */}
          <div className={`slider ${openFormLogin ? "login" : "register"}`}>
            <div className='text-data h-full flex flex-col justify-end gap-2 text-light p-6'>
              <span className='font-bold text-2xl'>Welcome</span>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.?</p>
              <span className='bg-primary p-2 font-bold w-fit rounded'>Get 20% Off</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserLoginRegisterForm
