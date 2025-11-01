"use client"

import React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { PiArrowCircleRightFill } from "react-icons/pi"
import { FiChevronUp, FiLoader, FiEye, FiEyeOff } from "react-icons/fi"
import { setAuthCookies } from "@/lib/auth"

export function MorphingLoginButton({ externalOpen, onExternalOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const router = useRouter()

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = (value) => {
    if (onExternalOpenChange) {
      onExternalOpenChange(value)
    } else {
      setInternalOpen(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        // Handle Login
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
          credentials: "include",
        })

        const result = await response.json()

        if (result.success && result.user) {
          // Set auth cookies and localStorage
          setAuthCookies(result.user)

          setShowSuccess(true)

          // Reset after success and redirect
          setTimeout(() => {
            setShowSuccess(false)
            setOpen(false)
            router.push("/dashboard")
          }, 1500)
        } else {
          setError(result.message || "Login failed")
        }
      } else {
        // Handle Registration
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
        })

        const result = await response.json()

        if (result.success) {
          setShowSuccess(true)
          setRegisterData({ name: "", email: "", password: "" })

          // Reset after success and switch to login
          setTimeout(() => {
            setShowSuccess(false)
            setIsLogin(true)
          }, 2000)
        } else {
          setError(result.message || "Registration failed")
        }
      }
    } catch (error) {
      console.error(isLogin ? "Login error:" : "Registration error:", error)
      setError(isLogin ? "Login failed. Please try again." : "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <div className="h-full flex flex-col p-6 bg-white text-black">
      {/* Tab Navigation */}
      <div className="relative mb-6">
        <div className="flex bg-gray-100 rounded-full p-1 relative">
          <motion.div
            className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm"
            initial={false}
            animate={{
              x: isLogin ? 0 : "calc(100% - 4px)",
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            style={{ width: "calc(50% - 4px)", left: "4px" }}
          />
          <button
            type="button"
            onClick={() => {
              setIsLogin(true)
              setError("")
            }}
            className={`relative z-10 flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors ${
              isLogin ? "text-black" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false)
              setError("")
            }}
            className={`relative z-10 flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors ${
              !isLogin ? "text-black" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form Content - Flex grow to fill remaining space */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="space-y-5">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor={isLogin ? "email" : "signup-email"}
                  className="block text-sm font-medium text-black mb-2"
                >
                  Email
                </label>
                <input
                  id={isLogin ? "email" : "signup-email"}
                  type="email"
                  required
                  value={isLogin ? loginData.email : registerData.email}
                  onChange={(e) => {
                    if (isLogin) {
                      setLoginData({ ...loginData, email: e.target.value })
                    } else {
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                  }}
                  className="w-full px-4 py-3 text-sm rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor={isLogin ? "password" : "signup-password"}
                  className="block text-sm font-medium text-black mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id={isLogin ? "password" : "signup-password"}
                    type={showPassword ? "text" : "password"}
                    required
                    value={isLogin ? loginData.password : registerData.password}
                    onChange={(e) => {
                      if (isLogin) {
                        setLoginData({ ...loginData, password: e.target.value })
                      } else {
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                    }}
                    className="w-full px-4 py-3 pr-12 text-sm rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button - Positioned at bottom */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <FiLoader className="animate-spin h-5 w-5" />
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  )

  return (
    <div className="relative font-prosto-one font-normal">
      <PopoverForm
        open={open}
        setOpen={setOpen}
        openChild={formContent}
        showSuccess={showSuccess}
        successChild={
          <PopoverFormSuccess
            title={isLogin ? "Welcome Back!" : "Account Created!"}
            description={
              isLogin
                ? "You've been signed in successfully"
                : "Registration successful! Please sign in with your new account."
            }
          />
        }
        width="420px"
        height="520px"
        showCloseButton={false}
        title="Sign In"
        displayTitle={isLogin ? "Sign In" : "Sign Up"}
      />
    </div>
  )
}

function PopoverForm({
  open,
  setOpen,
  openChild,
  showSuccess,
  successChild,
  width = "364px",
  height = "192px",
  title = "Feedback",
  displayTitle,
  showCloseButton = false,
}) {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useClickOutside(ref, () => setOpen(false))

  const effectiveTitle = displayTitle || title

  return (
    <>
      <div key={title} className="flex min-h-[300px] w-full items-center justify-center">
        {/* Morphing Button */}
        <motion.label
          layoutId={`${title}-wrapper`}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
          style={{ borderRadius: open ? 10 : 9999 }}
        >
          <input type="checkbox" checked={open} className="peer hidden" readOnly />
          <motion.div
            className="group relative flex w-fit items-center gap-3 overflow-hidden p-3 px-6 font-extrabold text-white bg-orange-500 transition-all hover:text-white active:scale-90"
            style={{ borderRadius: open ? 10 : 9999 }}
          >
            <motion.div layoutId={`${title}-title`} className="z-10">
              <p className="font-extrabold">{effectiveTitle.toUpperCase()}</p>
            </motion.div>
            <div className="relative">
              <div className="absolute inset-0 bg-black rounded-full scale-0 group-hover:scale-[1500%] transition-transform duration-500 origin-center"></div>
              <PiArrowCircleRightFill className="w-6 h-6 relative z-10 text-white group-hover:text-white group-hover:-rotate-45 group-hover:scale-130 transition-all duration-200" />
            </div>
          </motion.div>
        </motion.label>
      </div>

      {/* Portal for modal overlay */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Blur background overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-[9999]"
                onClick={() => setOpen(false)}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              {/* Modal content */}
              <motion.div
                layoutId={`${title}-wrapper`}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-muted shadow-[0_0_0_1px_rgba(0,0,0,0.08),0px_1px_2px_rgba(0,0,0,0.04)] outline-none z-[10000]"
                ref={ref}
                style={{ borderRadius: 10, width, height, position: 'fixed' }}
              >
                <motion.span
                  aria-hidden
                  className="absolute left-4 top-[17px] text-sm text-muted-foreground data-[success]:text-transparent"
                  layoutId={`${title}-title`}
                  data-success={showSuccess}
                >
                  {effectiveTitle}
                </motion.span>
                {showCloseButton && (
                  <div className="absolute -top-[5px] left-1/2 transform -translate-x-1/2 w-[12px] h-[26px] flex items-center justify-center z-20">
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute z-10 -mt-1 flex items-center justify-center w-[10px] h-[6px] text-muted-foreground hover:text-foreground focus:outline-none rounded-full"
                      aria-label="Close"
                    >
                      <FiChevronUp className="text-muted-foreground/80" />
                    </button>
                    <PopoverFormCutOutTopIcon />
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ y: -32, opacity: 0, filter: "blur(4px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                      className="flex h-full flex-col items-center justify-center"
                    >
                      {successChild || <PopoverFormSuccess />}
                    </motion.div>
                  ) : (
                    <motion.div
                      exit={{
                        scale: 0.95,
                        opacity: 0,
                        filter: "blur(4px)",
                        transition: { duration: 0.2, ease: "easeInOut" },
                      }}
                      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                      key="open-child"
                      style={{ borderRadius: 10 }}
                      className="h-full bg-white shadow-lg z-20"
                    >
                      {openChild}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

const useClickOutside = (ref, handleOnClickOutside) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      handleOnClickOutside(event)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handleOnClickOutside])
}

export function PopoverFormSuccess({ title = "Success", description = "Thank you for your submission" }) {
  return (
    <>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="-mt-1">
        <path
          d="M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z"
          fill="#2090FF"
          fillOpacity="0.16"
        />
        <path
          d="M12.1334 16.9667L15.0334 19.8667L19.8667 13.1M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z"
          stroke="#2090FF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="mb-1 mt-2 text-sm font-medium text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs text-pretty mx-auto text-center">{description}</p>
    </>
  )
}

function PopoverFormCutOutTopIcon({
  width = 44,
  height = 30,
}) {
  const aspectRatio = 6 / 12
  const calculatedHeight = width * aspectRatio
  const calculatedWidth = height / aspectRatio
  const finalWidth = Math.min(width, calculatedWidth)
  const finalHeight = Math.min(height, calculatedHeight)

  return (
    <svg
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 6 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rotate-90 mt-[1px]"
      preserveAspectRatio="none"
    >
      <g clipPath="url(#clip0_2029_22)">
        <path
          d="M0 2C0.656613 2 1.30679 2.10346 1.91341 2.30448C2.52005 2.5055 3.07124 2.80014 3.53554 3.17157C3.99982 3.54301 4.36812 3.98396 4.6194 4.46927C4.87067 4.95457 5 5.47471 5 6C5 6.52529 4.87067 7.04543 4.6194 7.53073C4.36812 8.01604 3.99982 8.45699 3.53554 8.82843C3.07124 9.19986 2.52005 9.4945 1.91341 9.69552C1.30679 9.89654 0.656613 10 0 10V6V2Z"
          className="fill-muted"
        />
        <path
          d="M1 12V10C2.06087 10 3.07828 9.57857 3.82843 8.82843C4.57857 8.07828 5 7.06087 5 6C5 4.93913 4.57857 3.92172 3.82843 3.17157C3.07828 2.42143 2.06087 2 1 2V0"
          className="stroke-border"
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2029_22">
          <rect width={finalWidth} height={finalHeight} fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}