import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/frontend/Home';
import About from './components/frontend/About';
import "./assets/css/style.scss";
import Projects from './components/frontend/Projects';
import Notices from './components/frontend/Notices';
import Contact from './components/frontend/Contact';
import ScrollToTop from './components/common/ScrollToTop';
import CitizenPortal from './components/frontend/CitizenPortal';


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
          <Route path='/citizen-portal' element={<CitizenPortal />} />

        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
