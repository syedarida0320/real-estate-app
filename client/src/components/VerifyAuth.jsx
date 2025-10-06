import { Navigate, redirect } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function VerifyAuth({ children }) {
  const { user } = useAuth()

  if (!user) {
    redirect('/login');
  }
  return children
}
