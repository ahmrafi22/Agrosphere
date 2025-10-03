import Cookies from "js-cookie"

export const setAuthCookies = (user) => {

  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("userId", user.id)
  }

  Cookies.set("user-id", user.id, {
    expires: 7, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  Cookies.set("auth-token", user.id, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
}

export const removeAuthCookies = () => {
  // Remove from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
  }

  // Remove client-side cookie
  Cookies.remove("user-id")
  Cookies.remove("auth-token")
}

export const getAuthToken = () => {
  // Try to get from client-side cookie first
  const clientToken = Cookies.get("user-id")
  if (clientToken) return clientToken

  // Fallback to server cookie
  return Cookies.get("auth-token")
}

export const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
  return null
}

export const getUserIdFromStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId")
  }
  return null
}

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    const userId = localStorage.getItem("userId")
    const clientToken = Cookies.get("user-id")
    return !!(userId && clientToken)
  }
  return false
}
