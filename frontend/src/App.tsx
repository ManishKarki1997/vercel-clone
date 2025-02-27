import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import Home from "./features/home/pages/home";
import LoginPage from "./features/home/pages/login";
import SignupPage from "./features/home/pages/signup";
import { Toaster } from "./components/ui/sonner";
import { profileAction } from "./features/home/actions/auth.action";
import React from "react";
import AppDashboard from "./features/app/pages/app-dashboard";
import { AxiosError } from "axios";
import { toast } from "sonner";
import AuthGuard from "./lib/auth-guard";



const queryClient = new QueryClient()

const AppContent = () => {

  const navigate = useNavigate();
  const isLoginErrorToastShown = React.useRef(false)

  const { data: profileData, error } = useQuery({
    queryFn: profileAction,
    queryKey: ['profile'],
  })


  React.useEffect(() => {
    if (profileData) {
      navigate("/app")
    }
  }, [navigate, profileData])

  React.useEffect(() => {
    const isPreviouslyLoggedIn = localStorage.getItem("isLoggedIn")

    if ((error as AxiosError)?.status === 401 && isPreviouslyLoggedIn === 'true') {
      if (!isLoginErrorToastShown.current) {
        toast.error(error?.response?.data.message || "Session expired. Please login again")
        isLoginErrorToastShown.current = true
      }

      localStorage.removeItem("isLoggedIn")

      navigate("/login")
    }
  }, [error, navigate])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path={"/app"}>
        <Route path="" element={
          <AuthGuard>
            <AppDashboard />
          </AuthGuard>
        }
        />
      </Route>
    </Routes>
  )
}

function App() {


  return (
    <>
      <BrowserRouter>

        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" />

          <AppContent />
        </QueryClientProvider>
      </BrowserRouter>

    </>
  )
}

export default App
