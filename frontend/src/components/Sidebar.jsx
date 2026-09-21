import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-8">
        EngageFlow
      </h1>

      <nav className="space-y-2">

        <NavLink
          to="/dashboard"
          className="block px-4 py-3 rounded-lg hover:bg-slate-800"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/clients"
          className="block px-4 py-3 rounded-lg hover:bg-slate-800"
        >
          Clients
        </NavLink>

        <NavLink
  to="/engagements"
  className={({ isActive }) =>
    `block px-4 py-3 rounded-lg ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`
  }
>
  Engagements
</NavLink>

        <NavLink
  to="/tasks"
  className={({ isActive }) =>
    `block rounded-lg px-4 py-3 ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`
  }
>
  Tasks
</NavLink>

        <NavLink
  to="/services"
  className={({ isActive }) =>
    `block px-4 py-3 rounded-lg ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`
  }
>
  Services
</NavLink>


<NavLink
  to="/task-templates"
  className={({ isActive }) =>
    `block px-4 py-3 rounded-lg ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`
  }
>
  Task Templates
</NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;