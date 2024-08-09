import Cookies from 'js-cookie'

const TokenKey = 'hip_token'

export const getToken = () => Cookies.get(TokenKey)
export const setToken = token => Cookies.set(TokenKey, token)

export const removeToken = () => {
  return new Promise(resolve => {
    Cookies.remove(TokenKey)
    resolve()
  })
}
