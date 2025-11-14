import React, { createContext, useState, useEffect } from 'react'

export const UserContext = createContext()

const UserProvider = ({ children }) => {

  let [user, setUser] = useState({
    logedIn: false
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      let token = localStorage.getItem('token')

      if (!token) throw ("token not found !")

      let result = await requestUserProfile(token)

      console.log(result)

      if (result.status != 200) throw ("unable to fetch user profile !")

      setUser(prev => {
        return { ...result.data.userData, logedIn: true }
      })

    } catch (err) {
      console.log("profile fetching error : ", err)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser({
      logedIn: false
    })
  }

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider