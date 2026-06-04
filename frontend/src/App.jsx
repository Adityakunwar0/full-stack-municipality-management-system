import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/frontend/Home';
import About from './components/frontend/About';
import "./assets/css/style.scss";
import Projects from './components/frontend/Projects';
import Notices from './components/frontend/Notices';
import Contact from './components/frontend/Contact';
import ScrollToTop from './components/common/ScrollToTop';
import Login from './components/frontend/Login';
import Complaint from './components/frontend/Complaint';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/backend/Dashboard";
import RequireAuth from "./components/common/RequireAuth";
import AdminPanel from './components/backend/AdminPanel';
import { default as ShowProjects } from "./components/backend/projects/Show";
import { default as CreateProjects } from "./components/backend/projects/Create";
import { default as EditProjects } from "./components/backend/projects/Edit";
import { default as ShowNotices } from "./components/backend/notices/Show";
import { default as CreateNotices } from "./components/backend/notices/Create";
import { default as EditNotices } from "./components/backend/notices/Edit";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/notices' element={<Notices />} />
          <Route path='/contacts' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/complaint' element={<Complaint />} />

          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth role="admin">
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <RequireAuth role="user">
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/panel"
            element={
              <RequireAuth  >
                <AdminPanel />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <RequireAuth>
                <ShowProjects />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/projects/create"
            element={
              <RequireAuth>
                <CreateProjects />
              </RequireAuth>
            }
          />
           <Route
            path="/admin/projects/edit/:id"
            element={
              <RequireAuth>
                <EditProjects />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/notices"
            element={
              <RequireAuth>
                <ShowNotices />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/notices/create"
            element={
              <RequireAuth>
                <CreateNotices />
              </RequireAuth>
            }
          />
           <Route
            path="/admin/notices/edit/:id"
            element={
              <RequireAuth>
                <EditNotices />
              </RequireAuth>
            }
          />

        </Routes>

      </BrowserRouter>
      <ToastContainer />

    </>
  )
}

export default App
