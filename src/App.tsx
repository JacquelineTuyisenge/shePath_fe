import HomePage from './components/Home';
import { Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import Login from './auth/Login';
import AboutPage from './components/About';
import AdminDashboard from './dashboards/AdminDash';
import MentorDashboard from './dashboards/MentorDash';
import ParentDashboard from './dashboards/ParentDash';
import CoursesList from './components/Courses';
import CourseDetails from './components/CourseDetails';
import ProtectedRoute from './auth/ProtectedRoute';
import NotFound from './features/NotFound';
import PrivacyPolicy from './components/Policy';
import TopicList from './components/Community';
import ForgotPassword from './components/Forgot';
import ResetPassword from './components/Reset';
import LearnerDashboard from './dashboards/LearnerDash';

function App() {
 
  return(
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path='/courses'>
            <Route index element={<CoursesList />} />
            <Route path=':id' element={<CourseDetails />} />
          </Route>
          <Route path='/policy' element={<PrivacyPolicy />} />
        </Route>
        <Route path='/community' element={<TopicList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route index element={<HomePage />}/>
        <Route path='/login' element={<Login />}/>

        {/* protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Learner"]} />}>
          <Route path="/learner" element={<LearnerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
          <Route path="/mentor" element={<MentorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
          <Route path="/parent" element={<ParentDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
