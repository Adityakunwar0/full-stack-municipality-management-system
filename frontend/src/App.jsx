import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/frontend/Home';
import About from './components/frontend/About';
import "./assets/css/style.scss";


const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

      </Routes>
      
      </BrowserRouter>
      
    </>
  )
}

export default App
