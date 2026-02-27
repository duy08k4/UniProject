import { Route, Routes } from "react-router-dom"

// Component
import { useTheme } from "./ui/components/ToggleTheme.comp"

import LandingPageLayout from "./ui/layouts/Layout"
import AuthLayout from "./ui/layouts/AuthLayout"
import SuperAdminLayout from "./ui/layouts/SuperAdminLayout"

import Home from "./ui/pages/Home"
import Project from "./ui/pages/Project"
import Contact from "./ui/pages/Contact"

import ProjectDetail from "./ui/pages/ProjectDetail"

import SignIn from "./ui/pages/SignIn"
import SignUp from "./ui/pages/SignUp"
import RequireResetPassword from "./ui/pages/RequireResetPassword"
import ResetPassword from "./ui/pages/ResetPassword"

// Super admin
import Overview from "./ui/pages/superadmin/Overview"
import UserManagement from "./ui/pages/superadmin/UserManagement"
import ClassManagement from "./ui/pages/superadmin/ClassManagement"

function App() {
  useTheme();
  return (
    <Routes>
      <Route element={<LandingPageLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Project />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="projects/:project-id" element={<ProjectDetail />} />

      <Route path="auth" element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="require-reset" element={<RequireResetPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="super-admin" element={<SuperAdminLayout />} >
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="classes" element={<ClassManagement />} />
      </Route>
    </Routes>
  )
}

export default App
