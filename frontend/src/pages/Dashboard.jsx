import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import TaskOverview from "../components/TaskOverview";
import RecentEngagements from "../components/RecentEngagements";

import { getDashboardStats } from "../api/dashboardApi";

const Dashboard = () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userName = user?.name || "User";
  
  const [stats, setStats] = useState({
    openTasks: 0,
    dueToday: 0,
    overdue: 0,
    waitingForClient: 0,
    waitingForReview: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();

      setStats(data.stats);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        <Navbar />

        <main className="p-6">

          {/* Welcome section */}

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h1 className="text-2xl font-bold text-slate-800">
                Hello, {userName}
              </h1>

              <p className="mt-1 text-slate-500">
                Here's what's happening with your engagements today.
              </p>

            </div>

          </div>


          {/* Dashboard Error */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          {/* Statistics */}

          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Open Tasks"
              value={loading ? "..." : stats.openTasks}
              description="Tasks currently open"
            />

            <StatCard
              title="Due Today"
              value={loading ? "..." : stats.dueToday}
              description="Tasks due today"
            />

            <StatCard
              title="Overdue"
              value={loading ? "..." : stats.overdue}
              description="Tasks past due date"
            />

            <StatCard
              title="Waiting for Review"
              value={loading ? "..." : stats.waitingForReview}
              description="Tasks awaiting review"
            />

          </div>


          {/* Charts / Engagement */}

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
{/* <TaskOverview
  notStarted={stats.notStarted}
  inProgress={stats.inProgress}
  waitingForClient={stats.waitingForClient}
  waitingForReview={stats.waitingForReview}
  changesRequested={stats.changesRequested}
  loading={loading}
/> */}

            <RecentEngagements />

          </div>


        </main>

      </div>

    </div>
  );
};

export default Dashboard;









// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import StatCard from "../components/StatCard";
// import TaskOverview from "../components/TaskOverview";
// import RecentEngagements from "../components/RecentEngagements";

// const Dashboard = () => {
//   return (
//     <div className="flex min-h-screen bg-slate-50">

//       {/* Sidebar */}
//       <Sidebar />
       
       
//       {/* Main Content */}
//       <div className="flex-1">

//         <Navbar />

//         <main className="p-6">

//           {/* Welcome section */}

//           <div className="flex items-center justify-between mb-6">

//             <div>

//               <h1 className="text-2xl font-bold text-slate-800">
//                 Hello, Dipanshu
//               </h1>

//               <p className="text-slate-500 mt-1">
//                 Here's what's happening with your engagements today.
//               </p>

//             </div>

//             {/* <button className="bg-slate-900 text-white px-5 py-3 rounded-lg hover:bg-slate-800">
//               + Create Engagement
//             </button> */}

//           </div>


//           {/* Statistics */}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

//             <StatCard
//               title="Open Tasks"
//               value="24"
//               description="Tasks currently open"
//             />

//             <StatCard
//               title="Due Today"
//               value="6"
//               description="Tasks due today"
//             />

//             <StatCard
//               title="Overdue"
//               value="3"
//               description="Tasks past due date"
//             />

//             <StatCard
//               title="Waiting for Review"
//               value="5"
//               description="Tasks awaiting review"
//             />

//           </div>


//           {/* Charts / Engagement */}

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

//             <TaskOverview />

//             <RecentEngagements />

//           </div>


//           {/* My Tasks */}

//           {/* <div className="bg-white border border-slate-200 rounded-xl p-6">

//             <h2 className="text-lg font-semibold mb-5">
//               My Tasks
//             </h2>

//             <div className="space-y-4">

//               <div className="flex items-center justify-between border-b pb-4">

//                 <div>
//                   <p className="font-medium">
//                     Collect financial documents
//                   </p>

//                   <p className="text-sm text-slate-500">
//                     ABC Pvt Ltd · Monthly Accounting
//                   </p>
//                 </div>

//                 <span className="px-3 py-1 rounded-full text-xs bg-slate-100">
//                   In Progress
//                 </span>

//                 <p className="text-sm text-slate-500">
//                   Due Sep 20
//                 </p>

//               </div>


//               <div className="flex items-center justify-between border-b pb-4">

//                 <div>
//                   <p className="font-medium">
//                     Prepare monthly report
//                   </p>

//                   <p className="text-sm text-slate-500">
//                     XYZ Solutions · Monthly Accounting
//                   </p>
//                 </div>

//                 <span className="px-3 py-1 rounded-full text-xs bg-slate-100">
//                   Not Started
//                 </span>

//                 <p className="text-sm text-slate-500">
//                   Due Sep 25
//                 </p>

//               </div>


//               <div className="flex items-center justify-between">

//                 <div>
//                   <p className="font-medium">
//                     Manager review
//                   </p>

//                   <p className="text-sm text-slate-500">
//                     Acme Corp · Tax Compliance
//                   </p>
//                 </div>

//                 <span className="px-3 py-1 rounded-full text-xs bg-slate-100">
//                   Ready for Review
//                 </span>

//                 <p className="text-sm text-slate-500">
//                   Due Sep 28
//                 </p>

//               </div>

//             </div>

//           </div> */}

//         </main>

//       </div>

//     </div>
//   );
// };

// export default Dashboard;