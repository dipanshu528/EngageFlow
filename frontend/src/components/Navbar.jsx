import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notificationApi";

const Navbar = () => {
  const [showMenu, setShowMenu] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userName =
    user?.name || "User";

  // Get initials
  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Convert role to readable name
  const roleName =
    user?.role === "ADMIN"
      ? "Administrator"
      : user?.role === "TEAM_MEMBER"
      ? "Team Member"
      : user?.role === "MANAGER"
      ? "Manager"
      : user?.role || "User";

  // Page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/dashboard":
        return "Dashboard";

      case "/tasks":
        return "Tasks";

      case "/clients":
        return "Clients";

      case "/engagements":
        return "Engagements";

      case "/task-templates":
        return "Task Templates";

      case "/services":
        return "Services";

      case "/users":
        return "Users";

      default:
        return "Dashboard";
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const data =
        await getNotifications();

      setNotifications(
        data.notifications || []
      );

      setUnreadCount(
        data.unreadCount || 0
      );
    } catch (error) {
      console.error(
        "NOTIFICATION ERROR:",
        error
      );
    }
  };

  // Initial notification fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Check for new notifications every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Mark notification as read
  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(
          notification._id
        );

        setNotifications(
          (previousNotifications) =>
            previousNotifications.map(
              (item) =>
                item._id ===
                notification._id
                  ? {
                      ...item,
                      isRead: true,
                    }
                  : item
            )
        );

        setUnreadCount(
          (previousCount) =>
            Math.max(
              previousCount - 1,
              0
            )
        );
      }

      setShowNotifications(false);

      // Go to Tasks page
      if (notification.task) {
        navigate("/tasks");
      }
    } catch (error) {
      console.error(
        "MARK NOTIFICATION ERROR:",
        error
      );
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications(
        (previousNotifications) =>
          previousNotifications.map(
            (notification) => ({
              ...notification,
              isRead: true,
            })
          )
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "MARK ALL READ ERROR:",
        error
      );
    }
  };

  // Format notification date
  const formatNotificationDate = (
    date
  ) => {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Left */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <span className="text-xl">
              🔔
            </span>

            {/* Unread count */}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>

                  <p className="text-xs text-slate-500">
                    {unreadCount} unread
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={
                      handleMarkAllRead
                    }
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications */}
              <div className="max-h-96 overflow-y-auto">

                {notifications.length ===
                0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">
                      No notifications
                    </p>
                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <button
                        key={
                          notification._id
                        }
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                          !notification.isRead
                            ? "bg-blue-50/50"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3">

                          {/* Unread dot */}
                          <div className="pt-1">
                            <span
                              className={`block h-2.5 w-2.5 rounded-full ${
                                notification.isRead
                                  ? "bg-slate-200"
                                  : "bg-blue-500"
                              }`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="text-sm font-semibold text-slate-800">
                              {
                                notification.title
                              }
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                              {
                                notification.message
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatNotificationDate(
                                notification.createdAt
                              )}
                            </p>

                          </div>
                        </div>
                      </button>
                    )
                  )
                )}

              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative">

          {/* Avatar + Name */}
          <button
            type="button"
            onClick={() =>
              setShowMenu(!showMenu)
            }
            className="flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-slate-50"
          >

            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 font-semibold text-white">
              {initials}
            </div>

            {/* User information */}
            <div className="text-left">
              <p className="text-sm font-medium text-slate-800">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                {roleName}
              </p>
            </div>

          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-12 z-50 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;











// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [showMenu, setShowMenu] = useState(false);

//   const navigate = useNavigate();

//   const user = JSON.parse(
//     localStorage.getItem("user") || "null"
//   );

//   const userName = user?.name || "User";

//   // Get initials
//   const initials = userName
//     .split(" ")
//     .map((word) => word[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   // Convert role to readable name
//   const roleName =
//     user?.role === "ADMIN"
//       ? "Administrator"
//       : user?.role === "TEAM_MEMBER"
//       ? "Team Member"
//       : user?.role === "MANAGER"
//       ? "Manager"
//       : user?.role || "User";

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     navigate("/login");
//   };

//   return (
//     <header className="h-16 bg-white border-b flex items-center justify-between px-6">

//       {/* Left */}
//       <div>
//         <h2 className="text-xl font-semibold text-slate-800">
//           Dashboard
//         </h2>
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-4">

//         {/* Notification */}
//         <button className="text-slate-500">
//           🔔
//         </button>

//         {/* User */}
//         <div className="relative">

//           {/* Avatar + Name */}
//           <button
//             type="button"
//             onClick={() =>
//               setShowMenu(!showMenu)
//             }
//             className="flex items-center gap-3 hover:bg-slate-50 rounded-lg px-2 py-1 transition"
//           >

//             {/* Avatar */}
//             <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">
//               {initials}
//             </div>

//             {/* User information */}
//             <div className="text-left">
//               <p className="text-sm font-medium text-slate-800">
//                 {userName}
//               </p>

//               <p className="text-xs text-slate-500">
//                 {roleName}
//               </p>
//             </div>

//           </button>

//           {/* Dropdown */}
//           {showMenu && (
//             <div className="absolute right-0 top-12 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">

//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//               >
//                 Logout
//               </button>

//             </div>
//           )}

//         </div>

//       </div>

//     </header>
//   );
// };

// export default Navbar;




