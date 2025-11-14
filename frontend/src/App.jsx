import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import UserProvider from "./context/UserContext.jsx";
import MessageProvider from "./context/MessageContext.jsx";
import Message from "./components/Message.jsx";
import UserLoginRegisterPage from "./pages/UserLoginRegisterPage.jsx";

const App = () => {
  return (
    <UserProvider>
      <MessageProvider>
        <Message />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-login-register" element={<UserLoginRegisterPage />} />
          </Routes>
        </BrowserRouter>
      </MessageProvider>
    </UserProvider>
  )
};

export default App;