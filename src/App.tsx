import React from 'react'
import HomePage from './components/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import AboutPage from './components/About';
import AdminDashboard from './dashboards/AdminDash';
import LearnerDashboard from './dashboards/LearnerDash';
import MentorDashboard from './dashboards/MentorDash';
import ParentDashboard from './dashboards/ParentDash';

function App() {
  return(
    <>
      <Routes>
        <Route index element={<HomePage />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/about' element={<AboutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/learner" element={<LearnerDashboard />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
      </Routes>
    </>
  );
}

export default App
