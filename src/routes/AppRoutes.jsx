import { Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'
import GuestRoute from './GuestRoute'
import Home from '../pages/Home'
import Blogs from '../pages/Blogs'
import BlogDetail from '../pages/BlogDetail'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'
import CreatePost from '../pages/CreatePost'
import EditPost from '../pages/EditPost'
import Profile from '../pages/Profile'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:slug" element={<BlogDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts/new" element={<CreatePost />} />
          <Route path="posts/:postId/edit" element={<EditPost />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes