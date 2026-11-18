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
import AdminRoute from './AdminRoute'
import AdminLayout from '../layouts/AdminLayout'
import AdminOverview from '../pages/admin/AdminOverview'
import AdminPosts from '../pages/admin/AdminPosts'
import AdminEditPost from '../pages/admin/AdminEditPost'
import AdminCategories from '../pages/admin/AdminCategories'

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
          <Route path="admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/:postId/edit" element={<AdminEditPost />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>
          </Route>
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