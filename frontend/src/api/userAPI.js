import axios from 'axios'

let baseURL = import.meta.env.VITE_BASE_API_URL + "/user"

export const requestUserRegister = async (data) => {
  try {
    let result = await axios.post(`${baseURL}/user-register`, data)
    return result
  } catch (err) {
    throw err
  }
}

export const requestVerifyEmail = async (data) => {
  try {
    let result = await axios.post(`${baseURL}/user-verify-otp`, data)
    return result
  } catch (err) {
    throw err
  }
}

export const requestUserLogin = async (data) => {
  try {
    let result = await axios.post(`${baseURL}/user-login`, data)
    return result
  } catch (err) {
    throw err
  }
}

export const requestUserProfile = async (token) => {
  try {
    let result = await axios({
      method: "GET",
      url: `${baseURL}/fetch-user-profile`,
      headers: {
        authorization: token
      }
    })
    return result
  } catch (err) {
    throw err
  }
}
