import React from 'react'
import HomePage from './components/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import AboutPage from './components/About';

function App() {
  return(
    <>
      <Routes>
        <Route index element={<HomePage />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/about' element={<AboutPage />} />
      </Routes>
    </>
  );
}

export default App
