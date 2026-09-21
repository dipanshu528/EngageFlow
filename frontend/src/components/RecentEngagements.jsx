import { useEffect, useState } from "react";

import { getEngagements } from "../api/engagementApi";

const RecentEngagements = () => {
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecentEngagements();
  }, []);

  const fetchRecentEngagements = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEngagements();

      // Backend already returns newest first
      const recentThree = (data.engagements || []).slice(0, 3);

      setEngagements(recentThree);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load recent engagements"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-lg font-semibold">
          Recent Engagements
        </h2>

        <button className="text-sm text-slate-600 hover:underline">
          View All
        </button>

      </div>

      {loading && (
        <div className="py-6 text-center text-sm text-slate-500">
          Loading engagements...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && engagements.length === 0 && (
        <div className="py-6 text-center text-sm text-slate-500">
          No engagements found.
        </div>
      )}

      {!loading && !error && engagements.length > 0 && (
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-left text-slate-500">

                <th className="pb-3">Client</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Period</th>
                <th className="pb-3">Due Date</th>
                <th className="pb-3">Status</th>

              </tr>
            </thead>

            <tbody>

              {engagements.map((engagement) => (

                <tr
                  key={engagement._id}
                  className="border-b last:border-0"
                >

                  <td className="py-4 font-medium">
                    {engagement.client?.name || "-"}
                  </td>

                  <td className="py-4 text-slate-600">
                    {engagement.serviceType?.name || "-"}
                  </td>

                  <td className="py-4 text-slate-600">
                    {engagement.period || "-"}
                  </td>

                  <td className="py-4 text-slate-600">
                    {formatDate(engagement.dueDate)}
                  </td>

                  <td className="py-4">

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                      {formatStatus(engagement.status)}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default RecentEngagements;









// const RecentEngagements = () => {

//   const engagements = [
//     {
//       client: "ABC Pvt Ltd",
//       service: "Monthly Accounting",
//       period: "2026-09",
//       dueDate: "30 Sep 2026",
//       status: "In Progress"
//     },
//     {
//       client: "XYZ Solutions",
//       service: "Tax Compliance",
//       period: "2026-09",
//       dueDate: "25 Sep 2026",
//       status: "Ready for Review"
//     },
//     {
//       client: "Acme Corp",
//       service: "Monthly Accounting",
//       period: "2026-09",
//       dueDate: "30 Sep 2026",
//       status: "Not Started"
//     }
//   ];

//   return (
//     <div className="bg-white border border-slate-200 rounded-xl p-6">

//       <div className="flex justify-between items-center mb-5">

//         <h2 className="text-lg font-semibold">
//           Recent Engagements
//         </h2>

//         <button className="text-sm text-slate-600 hover:underline">
//           View All
//         </button>

//       </div>

//       <div className="overflow-x-auto">

//         <table className="w-full text-sm">

//           <thead>
//             <tr className="border-b text-left text-slate-500">

//               <th className="pb-3">Client</th>
//               <th className="pb-3">Service</th>
//               <th className="pb-3">Period</th>
//               <th className="pb-3">Due Date</th>
//               <th className="pb-3">Status</th>

//             </tr>
//           </thead>

//           <tbody>

//             {engagements.map((engagement) => (

//               <tr
//                 key={engagement.client}
//                 className="border-b last:border-0"
//               >

//                 <td className="py-4 font-medium">
//                   {engagement.client}
//                 </td>

//                 <td className="py-4 text-slate-600">
//                   {engagement.service}
//                 </td>

//                 <td className="py-4 text-slate-600">
//                   {engagement.period}
//                 </td>

//                 <td className="py-4 text-slate-600">
//                   {engagement.dueDate}
//                 </td>

//                 <td className="py-4">

//                   <span className="px-3 py-1 rounded-full text-xs bg-slate-100">
//                     {engagement.status}
//                   </span>

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// };

// export default RecentEngagements;