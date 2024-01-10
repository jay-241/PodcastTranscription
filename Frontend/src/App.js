import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './login';
import Registration from './registration';
import Podcastupload from './podcastupload';
import Podcast from './podcast';
import AboutUs from './Aboutus';
import Contactus from './ContactUs';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path='/registration' element={<Registration/>} />
          <Route exact path='/podcastupload' element={<Podcastupload/>} />
          <Route exact path='/podcast' element={<Podcast/>} />
          <Route exact path='/aboutus' element={<AboutUs/>} />
          <Route exact path='/contactus' element={<Contactus/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
