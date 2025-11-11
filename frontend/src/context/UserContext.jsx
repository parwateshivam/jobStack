import React, { createContext, useState } from 'react'

export const UserContext = createContext()

const UserProvider = ({ children }) => {
  let [user, setUser] = useState({
    logedIn: false,
    name: "Shivam Parwate"
  })
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider