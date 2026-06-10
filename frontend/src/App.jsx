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
import { default as ShowMembers } from "./components/backend/members/Show";
import { default as CreateMembers } from "./components/backend/members/Create";
import { default as EditMembers } from "./components/backend/members/Edit";
import { default as ShowStatistics } from "./components/backend/statistics/Show";
import { default as CreateStatistics } from "./components/backend/statistics/Create";
import { default as EditStatistics } from "./components/backend/statistics/Edit";
import { default as ShowQuotes } from "./components/backend/quotes/Show";
import { default as CreateQuotes } from "./components/backend/quotes/Create";
import { default as EditQuotes } from "./components/backend/quotes/Edit";

import { default as ShowServices } from "./components/backend/services/Show";
import { default as CreateServices } from "./components/backend/services/Create";
import { default as EditServices } from "./components/backend/services/Edit";

import { default as ShowComplaints } from "./components/backend/complaints/Show";
import { default as ViewComplaint } from "./components/backend/complaints/View";

import { default as ShowServiceRequests } from "./components/backend/serviceRequests/Show";
import { default as ViewServiceRequest } from "./components/backend/serviceRequests/View";
import Services from './components/frontend/Services';
import Request from './components/backend/user/Request';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='/services' element={<Services />} />
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
          <Route
            path="/admin/members"
            element={
              <RequireAuth>
                <ShowMembers />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/members/create"
            element={
              <RequireAuth>
                <CreateMembers />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/members/edit/:id"
            element={
              <RequireAuth>
                <EditMembers />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <RequireAuth>
                <ShowStatistics />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/statistics/create"
            element={
              <RequireAuth>
                <CreateStatistics />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/statistics/edit/:id"
            element={
              <RequireAuth>
                <EditStatistics />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/quotes"
            element={
              <RequireAuth>
                <ShowQuotes />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/quotes/create"
            element={
              <RequireAuth>
                <CreateQuotes />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/quotes/edit/:id"
            element={
              <RequireAuth>
                <EditQuotes />
              </RequireAuth>
            }
          />
          <Route path="/admin/complaints" element={<RequireAuth><ShowComplaints /></RequireAuth>} />
          <Route path="/admin/complaints/:id" element={<RequireAuth><ViewComplaint /></RequireAuth>} />
          <Route path="/admin/services" element={<RequireAuth>
            <ShowServices />
          </RequireAuth>} />
          <Route path="/admin/services/create" element={<RequireAuth>
            <CreateServices />
          </RequireAuth>} />
          <Route path="/admin/services/edit/:id" element={<RequireAuth>
            <EditServices />
          </RequireAuth>} />
          <Route path="/user/complaint" element={<RequireAuth><Complaint /></RequireAuth>} />
           <Route path="/admin/complaint" element={<RequireAuth><Complaint /></RequireAuth>} />
          

          

          <Route path="/admin/serviceRequests" element={<RequireAuth><ShowServiceRequests /></RequireAuth>} />
          <Route path="/admin/service-requests/:id" element={<RequireAuth><ViewServiceRequest /></RequireAuth>} />
          <Route path="/admin/my-requests" element={<RequireAuth><Request /></RequireAuth>} />

          <Route path="/user/my-requests" element={<RequireAuth><Request /></RequireAuth>} />
        </Routes>

      </BrowserRouter>
      <ToastContainer />

    </>
  )
}

export default App
