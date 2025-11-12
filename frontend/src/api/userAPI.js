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