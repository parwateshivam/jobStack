import React from 'react'
import { useContext } from 'react'
import { MessageContext } from '../context/MessageContext'

import '../stylesheets/Message.scss'

const Message = () => {

  let { showMessage } = useContext(MessageContext)
  if (showMessage.open == false) return null
  return (
    <div id='message' className={showMessage.status}>
      <span className='font-bold'>{showMessage.content}</span>
    </div>
  )
}

export default Message
