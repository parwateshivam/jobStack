import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import UserProvider from "./context/UserContext.jsx";
import UserLoginRegisterForm from "./components/UserLoginRegisterForm.jsx";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-login-register" element={<UserLoginRegisterForm />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
};

export default App;