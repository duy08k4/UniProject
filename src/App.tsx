import { Route, Routes } from "react-router-dom"

// Component
import { useTheme } from "./ui/components/ToggleTheme.comp"

import LandingPageLayout from "./ui/layouts/Layout"
import AuthLayout from "./ui/layouts/AuthLayout"

import Home from "./ui/pages/Home"
import Project from "./ui/pages/Project"
import Contact from "./ui/pages/Contact"

import SignIn from "./ui/pages/SignIn"
import SignUp from "./ui/pages/SignUp"

function App() {
  useTheme();
  return (
    <Routes>
      <Route element={<LandingPageLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Project />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
    </Routes>
  )
}

export default App
