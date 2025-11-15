import React, { useState, useContext, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { UserContext } from '../context/UserContext'
import { MessageContext } from '../context/MessageContext'
import { useNavigate } from 'react-router-dom'
import Profile from './Profile'
import JobTracker from './JobTracker'

import '../stylesheets/UserDashboard.scss'
import { requestUserProfile } from '../api/userAPI'

const UserDashboard = () => {

  let { user, logout, fetchUserProfile } = useContext(UserContext)

  let { triggreMessage } = useContext(MessageContext)

  let [selectedMenu, setSelectedMenu] = useState("")

  let navigate = useNavigate()

  let token = localStorage.getItem("token")

  useEffect(() => {
    checkDashbaordAccess()
  }, [])


  const checkDashbaordAccess = async () => {
    try {

      if (!token) throw ("token not found !")

      let result = await requestUserProfile(token)

      if (result.status != 200) throw ("token is invalid please login first !")

      await fetchUserProfile()

      triggreMessage("success", `welcome ${result.data.userData.name} to dashboard !`)

    } catch (err) {
      console.log("cannot provide dashboard access !")
      navigate("/user-login-register")
      triggreMessage("warning", "Please login first to access dashboard !")
    }
  }

  const handleMenuSelection = (e) => {
    console.log(e.target.id)
    setSelectedMenu(e.target.id)
  }

  const renderComponent = () => {
    switch (selectedMenu) {
      case "profile-btn": return <Profile />
        break;
      case "job-tracker-btn": return <JobTracker />
        break;
      default: return <Profile />
    }
  }

  return (
    <>
      <Header />
      <div id='user-dashboard'>
        <div className='sidebar-menu p-5'>
          <div className='intro text-light'>
            <ul className='flex flex-col gap-2'>
              <li className='font-bold'>Hi, {user.name ? user.name : ""} !</li>
              <li className='text-primary'>
                Loged In : {user.email ? user.email.userEmail : ""}
              </li>
              <li>
                <button onClick={() => { logout(); navigate("/user-login-register") }} className='bg-red-500 text-light py-2 px-5 rounded font-bold hover:bg-red-700 transition'>Logout</button>
              </li>
            </ul>

            <ul className='actions mt-10 flex flex-col gap-10'>
              <li id='profile-btn' onClick={handleMenuSelection} className='shadow outline outline-1 p-4 rounded bg-primary font-bold cursor-pointer'>
                My Profile
              </li>
              <li id='job-tracker-btn' onClick={handleMenuSelection} className='shadow outline outline-1 p-4 rounded bg-primary font-bold cursor-pointer'>
                Job Application Tracker
              </li>
            </ul>
          </div>

          <div className='profile'></div>

          <div className='job-tracker'></div>
        </div>

        <div className='content p-10'>
          {renderComponent()}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default UserDashboard