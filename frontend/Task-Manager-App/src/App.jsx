// @ts-nocheck
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/signUp';
import Dashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageTasks from './pages/Admin/ManageTasks';
import MyTasks from './pages/User/MyTasks';
import CreateTask from './pages/Admin/CreateTask';
import PrivateRoute from './routes/PrivateRoute';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route element={<PrivateRoute allowedRoles={['admin']}/>}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={['user']}/>}>
            <Route path="/user/my-tasks" element={<MyTasks />} />
            <Route path="/user/dashboard" element={<Dashboard/>}/>
          </Route>

        </Routes>
      </Router>

    </div>
  );
};

export default App;