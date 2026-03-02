import { Route, Routes } from "react-router-dom"

// Component
import { useTheme } from "./ui/components/ToggleTheme.comp"

import LandingPageLayout from "./ui/layouts/Layout"
import AuthLayout from "./ui/layouts/AuthLayout"
import SuperAdminLayout from "./ui/layouts/SuperAdminLayout"
import RoomAdminLayout from "./ui/layouts/RoomAdminLayout"

import Home from "./ui/pages/Home"
import Project from "./ui/pages/Project"
import Contact from "./ui/pages/Contact"

import ProjectDetail from "./ui/pages/ProjectDetail"

import SignIn from "./ui/pages/SignIn"
import SignUp from "./ui/pages/SignUp"
import RequireResetPassword from "./ui/pages/RequireResetPassword"
import ResetPassword from "./ui/pages/ResetPassword"

// Super admin
import Overview from "./ui/pages/superadmin/SAOverview"
import UserManagement from "./ui/pages/superadmin/SAUserManagement"
import ClassManagement from "./ui/pages/superadmin/SAClassManagement"
import Milestones from "./ui/pages/superadmin/SAMilestones"
import FormManagement from "./ui/pages/superadmin/SAFormManagement"
import SAScoreBoardManagement from "./ui/pages/superadmin/SAScoreBoardManagement"
import SASubmission from "./ui/pages/superadmin/SASubmission"

// Main
import Main from "./ui/pages/Main"
import RAOverview from "./ui/pages/roomadmin/RAOverview"
import RAMilestones from "./ui/pages/roomadmin/RAMilestones"

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
        <Route path="milestones" element={<Milestones />} />
        <Route path="forms" element={<FormManagement />} />
        <Route path="scoreboards" element={<SAScoreBoardManagement />} />
        <Route path="submission" element={<SASubmission />} />
      </Route>

      <Route path="main">
        <Route index element={<Main />} />
        <Route path="class/:classId" element={<RoomAdminLayout />}>
          <Route index element={<RAOverview />} />
          <Route path="milestones" element={<RAMilestones />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
