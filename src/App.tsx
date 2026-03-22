import { Route, Routes } from "react-router-dom"

// Component
import { useTheme } from "./ui/components/ToggleTheme.comp"
import SessionChecker from "./ui/components/SessionChecker"

// Layout
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
import SARolePermission from "./ui/pages/superadmin/SARolePermission"

// Main
import Main from "./ui/pages/Main"

// Room admin
import RAOverview from "./ui/pages/roomadmin/RAOverview"
import RAMembers from "./ui/pages/roomadmin/RAMembers"
import RAMilestones from "./ui/pages/roomadmin/RAMilestones"
import RAForms from "./ui/pages/roomadmin/RAForms"
import RAScoreboards from "./ui/pages/roomadmin/RAScoreboards"
import RAScoreboardsDetail from "./ui/pages/roomadmin/RAScoreboardsDetail"
import RASubmissions from "./ui/pages/roomadmin/RASubmissions"
import RASubmissionDetail from "./ui/pages/roomadmin/RASubmissionDetail"

// Student
import RoomStudentLayout from "./ui/layouts/RoomStudentLayout"
import SDMilestones from "./ui/pages/student/SDMilestones"
import SDMembers from "./ui/pages/student/SDMembers"
import SDScoreboards from "./ui/pages/student/SDScoreboards"
import SDSubmission from "./ui/pages/student/SDSubmission"

// Lecturer
import RoomLecturerLayout from "./ui/layouts/RoomLecturerLayout"
import LTScoreboards from "./ui/pages/lecturer/LTScoreboards"
import LTCommittee from "./ui/pages/lecturer/LTCommittee"

function App() {
  useTheme();
  return (
    <>
      <SessionChecker />
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
          <Route path="permission" element={<SARolePermission />} />
        </Route>

        <Route path="main">
          <Route index element={<Main />} />

          {/* Room admin */}
          <Route path="admin/class/:classId" element={<RoomAdminLayout />}>
            <Route index element={<RAOverview />} />
            <Route path="members" element={<RAMembers />} />
            <Route path="milestones" element={<RAMilestones />} />
            <Route path="forms" element={<RAForms />} />
            <Route path="scoreboards">
              <Route index element={<RAScoreboards />} />
              <Route path=":boardId" element={<RAScoreboardsDetail />} />
            </Route>

            <Route path="submission">
              <Route index element={<RASubmissions />} />
              <Route path=":formId" element={<RASubmissionDetail />} />
            </Route>
          </Route>

          {/* Student */}
          <Route path="student/class/:classId" element={<RoomStudentLayout />}>
            <Route index element={<SDMilestones />} />
            <Route path="members" element={<SDMembers />} />
            <Route path="scoreboards" element={<SDScoreboards />} />
            <Route path="submission" element={<SDSubmission />} />
          </Route>

          {/* Lecturer */}
          <Route path="lecturer/class/:classId" element={<RoomLecturerLayout />}>
            <Route index element={<SDMilestones />} />
            <Route path="members" element={<SDMembers />} />
            <Route path="committee" element={<LTCommittee />} />
            <Route path="committee-scoreboards" element={<LTScoreboards />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
