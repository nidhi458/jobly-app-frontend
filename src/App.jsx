import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import JobList from './features/jobs/JobList';
import JobForm from './features/jobs/JobForm';
import AppliedJobs from './features/applications/AppliedJobs';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/applied-jobs" element={<AppliedJobs />} />
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin/jobs" element={<JobList adminView />} /> 
          <Route path="/admin/create-job" element={<JobForm />} />
          <Route path="/admin/edit-job/:id" element={<JobForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
