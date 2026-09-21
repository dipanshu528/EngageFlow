import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import TaskTemplates from "./pages/TaskTemplates";
import Engagements from "./pages/Engagements";
import ClientDetail from "./pages/ClientDetail";
import Tasks from "./pages/Tasks";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register/>}
        />


        {/* Protected Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/services"
  element={
    <ProtectedRoute>
      <Services />
    </ProtectedRoute>
  }
/>

<Route
  path="/task-templates"
  element={
    <ProtectedRoute>
      <TaskTemplates />
    </ProtectedRoute>
  }
/>


        {/* Default route */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
  path="/engagements"
  element={
    <ProtectedRoute>
      <Engagements />
    </ProtectedRoute>
  }
/>

<Route
  path="/tasks"
  element={
    <ProtectedRoute>
      <Tasks />
    </ProtectedRoute>
  }
/>

<Route path="/clients/:id" element={<ClientDetail />} />

        <Route
  path="/clients"
  element={
    <ProtectedRoute>
      <Clients />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;