import { createContext, useState } from "react";

export const MessageContext = createContext()

const MessageProvider = ({ children }) => {

  let [showMessage, setShowMessage] = useState({
    status: "",
    content: "",
    open: false
  })

  let triggreMessage = (status, content) => {
    setShowMessage({
      status,
      content,
      open: true
    })

    setTimeout(() => {
      setShowMessage({
        status: "",
        content: "",
        open: false
      })
    }, 3000)
  }

  return (
    <MessageContext.Provider value={{ showMessage, triggreMessage }}>
      {children}
    </MessageContext.Provider>
  )
}

export default MessageProvider