import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { getClients } from "../api/clientApi";
import { getServices } from "../api/serviceApi";

import {
  createEngagement,
  getEngagements,
} from "../api/engagementApi";


const Engagement = () => {

  // =========================================
  // DATA
  // =========================================

  const [clients, setClients] = useState([]);

  const [services, setServices] = useState([]);

  const [engagements, setEngagements] = useState([]);


  // =========================================
  // FORM
  // =========================================

  const [client, setClient] = useState("");

  const [serviceType, setServiceType] = useState("");

  const [period, setPeriod] = useState("");

  const [startDate, setStartDate] = useState("");

  const [dueDate, setDueDate] = useState("");


  // =========================================
  // STATES
  // =========================================

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =========================================
  // FETCH ALL DATA
  // =========================================

  const fetchData = async () => {

    try {

      setLoading(true);

      setError("");


      const [
        clientsData,
        servicesData,
        engagementsData,
      ] = await Promise.all([

        getClients(),

        getServices(),

        getEngagements(),

      ]);


      // =====================================
      // CLIENTS
      // =====================================

      console.log(
        "CLIENTS:",
        clientsData
      );

      setClients(
        clientsData.clients || []
      );


      // =====================================
      // SERVICES
      // =====================================

      console.log(
        "SERVICES:",
        servicesData
      );

      setServices(
        servicesData.services || []
      );


      // =====================================
      // ENGAGEMENTS
      // =====================================

      console.log(
        "ENGAGEMENTS:",
        engagementsData
      );

      setEngagements(
        engagementsData.engagements || []
      );


    } catch (error) {

      console.error(
        "FETCH DATA ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load data"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // LOAD DATA WHEN PAGE OPENS
  // =========================================

  useEffect(() => {

    fetchData();

  }, []);


  // =========================================
  // CREATE ENGAGEMENT
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");


    // =====================================
    // VALIDATION
    // =====================================

    if (
      !client ||
      !serviceType ||
      !period ||
      !startDate ||
      !dueDate
    ) {

      setError(
        "Please fill all fields"
      );

      return;

    }


    // =====================================
    // DATE VALIDATION
    // =====================================

    if (
      new Date(dueDate) <
      new Date(startDate)
    ) {

      setError(
        "Due date cannot be before start date"
      );

      return;

    }


    try {

      setCreating(true);


      // =====================================
      // CREATE ENGAGEMENT
      // =====================================

      const data = await createEngagement({

        client,

        serviceType,

        period,

        startDate,

        dueDate,

      });


      console.log(
        "CREATED ENGAGEMENT:",
        data
      );


      // =====================================
      // SUCCESS MESSAGE
      // =====================================

      setSuccess(
        "Engagement created successfully"
      );


      // =====================================
      // RESET FORM
      // =====================================

      setClient("");

      setServiceType("");

      setPeriod("");

      setStartDate("");

      setDueDate("");


      // =====================================
      // REFRESH DATA
      // =====================================

      await fetchData();


    } catch (error) {

      console.error(
        "CREATE ENGAGEMENT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to create engagement"
      );

    } finally {

      setCreating(false);

    }

  };


  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {

    return (

      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex-1">

          <Navbar />

          <div className="p-6">

            <p className="text-gray-600">
              Loading...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <Sidebar />


      {/* MAIN CONTENT */}

      <div className="flex-1">

        <Navbar />


        <div className="p-6">


          {/* HEADER */}

          <div className="mb-6">

            <h1 className="text-2xl font-bold text-gray-800">

              Engagements

            </h1>

            <p className="text-gray-500 mt-1">

              Create and manage client engagements

            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">

              {error}

            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded">

              {success}

            </div>

          )}


          {/* CREATE ENGAGEMENT FORM */}

          <div className="bg-white rounded-lg shadow p-6 mb-8">

            <h2 className="text-lg font-semibold text-gray-800 mb-5">

              Create Engagement

            </h2>


            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >


              {/* CLIENT */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">

                  Client

                </label>

                <select
                  value={client}
                  onChange={(e) =>
                    setClient(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">

                    Select Client

                  </option>


                  {clients.map((item) => (

                    <option
                      key={item._id}
                      value={item._id}
                    >

                      {item.name}

                    </option>

                  ))}

                </select>

              </div>


              {/* SERVICE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">

                  Service Type

                </label>

                <select
                  value={serviceType}
                  onChange={(e) =>
                    setServiceType(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">

                    Select Service

                  </option>


                  {services.map((service) => (

                    <option
                      key={service._id}
                      value={service._id}
                    >

                      {service.name}

                    </option>

                  ))}

                </select>

              </div>


              {/* PERIOD */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">

                  Period

                </label>

                <input
                  type="text"
                  value={period}
                  onChange={(e) =>
                    setPeriod(e.target.value)
                  }
                  placeholder="Example: April 2026"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* START DATE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">

                  Start Date

                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* DUE DATE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">

                  Due Date

                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* BUTTON */}

              <div className="md:col-span-2">

                <button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {creating
                    ? "Creating..."
                    : "Create Engagement"}

                </button>

              </div>

            </form>

          </div>


          {/* ALL ENGAGEMENTS */}

          <div className="bg-white rounded-lg shadow">

            <div className="p-6 border-b">

              <h2 className="text-lg font-semibold text-gray-800">

                All Engagements

              </h2>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

                      Client

                    </th>

                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

                      Service

                    </th>

                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

                      Period

                    </th>

                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

                      Start Date

                    </th>

                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

                      Due Date

                    </th>

                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

                      Status

                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y">

                  {engagements.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >

                        No engagements found

                      </td>

                    </tr>

                  ) : (

                    engagements.map((engagement) => (

                      <tr
                        key={engagement._id}
                        className="hover:bg-gray-50"
                      >

                        {/* CLIENT */}

                        <td className="px-6 py-4">

                          {engagement.client?.name || "-"}

                        </td>


                        {/* SERVICE */}

                        <td className="px-6 py-4">

                          {engagement.serviceType?.name || "-"}

                        </td>


                        {/* PERIOD */}

                        <td className="px-6 py-4">

                          {engagement.period || "-"}

                        </td>


                        {/* START DATE */}

                        <td className="px-6 py-4">

                          {engagement.startDate
                            ? new Date(
                                engagement.startDate
                              ).toLocaleDateString()
                            : "-"}

                        </td>


                        {/* DUE DATE */}

                        <td className="px-6 py-4">

                          {engagement.dueDate
                            ? new Date(
                                engagement.dueDate
                              ).toLocaleDateString()
                            : "-"}

                        </td>


                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-700">

                            {engagement.status ||
                              "NOT_STARTED"}

                          </span>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};


export default Engagement;






// import { useEffect, useState } from "react";

// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// import { getClients } from "../api/clientApi";
// import { getServices } from "../api/serviceApi";

// import {
//   createEngagement,
//   getEngagements,
// } from "../api/engagementApi";

// import {
//   getAssignableUsers,
// } from "../api/userApi";


// const Engagement = () => {

//   // --------------------------------
//   // DATA
//   // --------------------------------

//   const [clients, setClients] = useState([]);

//   const [services, setServices] = useState([]);

//   const [teamMembers, setTeamMembers] = useState([]);

//   const [engagements, setEngagements] = useState([]);


//   // --------------------------------
//   // FORM
//   // --------------------------------

//   const [client, setClient] = useState("");

//   const [serviceType, setServiceType] = useState("");

//   const [assignedTo, setAssignedTo] = useState("");

//   const [period, setPeriod] = useState("");

//   const [startDate, setStartDate] = useState("");

//   const [dueDate, setDueDate] = useState("");


//   // --------------------------------
//   // STATES
//   // --------------------------------

//   const [loading, setLoading] = useState(true);

//   const [creating, setCreating] = useState(false);

//   const [error, setError] = useState("");

//   const [success, setSuccess] = useState("");


//   // --------------------------------
//   // FETCH DATA
//   // --------------------------------

//   const fetchData = async () => {

//     try {

//       setLoading(true);

//       setError("");

//       const [
//         clientsData,
//         servicesData,
//         teamMembersData,
//         engagementsData,
//       ] = await Promise.all([
//         getClients(),
//         getServices(),
//         getAssignableUsers(),
//         getEngagements(),
//       ]);


//       // --------------------------------
//       // CLIENTS
//       // --------------------------------

//       setClients(
//         clientsData.clients || []
//       );


//       // --------------------------------
//       // SERVICES
//       // --------------------------------

//       setServices(
//         servicesData.services || []
//       );


//       // --------------------------------
//       // TEAM MEMBERS
//       // --------------------------------

//       console.log(
//         "Assignable users:",
//         teamMembersData
//       );

//       setTeamMembers(
//         teamMembersData.users || []
//       );


//       // --------------------------------
//       // ENGAGEMENTS
//       // --------------------------------

//       setEngagements(
//         engagementsData.engagements || []
//       );

//     } catch (error) {

//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to load data"
//       );

//     } finally {

//       setLoading(false);

//     }
//   };


//   // --------------------------------
//   // USE EFFECT
//   // --------------------------------

//   useEffect(() => {

//     fetchData();

//   }, []);


//   // --------------------------------
//   // CREATE ENGAGEMENT
//   // --------------------------------

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     setError("");

//     setSuccess("");


//     // --------------------------------
//     // VALIDATION
//     // --------------------------------

//     if (
//       !client ||
//       !serviceType ||
//       !assignedTo ||
//       !period ||
//       !startDate ||
//       !dueDate
//     ) {

//       setError(
//         "Please fill all fields"
//       );

//       return;
//     }


//     // --------------------------------
//     // DATE VALIDATION
//     // --------------------------------

//     if (
//       new Date(dueDate) <
//       new Date(startDate)
//     ) {

//       setError(
//         "Due date cannot be before start date"
//       );

//       return;
//     }


//     try {

//       setCreating(true);


//       // --------------------------------
//       // CREATE ENGAGEMENT
//       // --------------------------------

//       const data = await createEngagement({

//         client,

//         serviceType,

//         assignedTo,

//         period,

//         startDate,

//         dueDate,

//       });


//       console.log(
//         "Created engagement:",
//         data
//       );


//       // --------------------------------
//       // SUCCESS
//       // --------------------------------

//       setSuccess(
//         "Engagement created successfully"
//       );


//       // --------------------------------
//       // RESET FORM
//       // --------------------------------

//       setClient("");

//       setServiceType("");

//       setAssignedTo("");

//       setPeriod("");

//       setStartDate("");

//       setDueDate("");


//       // --------------------------------
//       // REFRESH DATA
//       // --------------------------------

//       await fetchData();

//     } catch (error) {

//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to create engagement"
//       );

//     } finally {

//       setCreating(false);

//     }
//   };


//   // --------------------------------
//   // LOADING
//   // --------------------------------

//   if (loading) {

//     return (

//       <div className="flex">

//         <Sidebar />

//         <div className="flex-1">

//           <Navbar />

//           <div className="p-6">

//             Loading...

//           </div>

//         </div>

//       </div>

//     );

//   }


//   // --------------------------------
//   // UI
//   // --------------------------------

//   return (

//     <div className="flex min-h-screen bg-gray-100">

//       {/* SIDEBAR */}

//       <Sidebar />


//       {/* MAIN */}

//       <div className="flex-1">

//         <Navbar />


//         <div className="p-6">


//           {/* -------------------------------- */}
//           {/* HEADER */}
//           {/* -------------------------------- */}

//           <div className="mb-6">

//             <h1 className="text-2xl font-bold text-gray-800">

//               Engagements

//             </h1>

//             <p className="text-gray-500 mt-1">

//               Create and manage client engagements

//             </p>

//           </div>


//           {/* -------------------------------- */}
//           {/* ERROR */}
//           {/* -------------------------------- */}

//           {error && (

//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">

//               {error}

//             </div>

//           )}


//           {/* -------------------------------- */}
//           {/* SUCCESS */}
//           {/* -------------------------------- */}

//           {success && (

//             <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">

//               {success}

//             </div>

//           )}


//           {/* -------------------------------- */}
//           {/* CREATE ENGAGEMENT */}
//           {/* -------------------------------- */}

//           <div className="bg-white rounded-lg shadow p-6 mb-8">

//             <h2 className="text-lg font-semibold mb-5">

//               Create Engagement

//             </h2>


//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-5"
//             >


//               {/* -------------------------------- */}
//               {/* CLIENT */}
//               {/* -------------------------------- */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Client

//                 </label>

//                 <select
//                   value={client}
//                   onChange={(e) =>
//                     setClient(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 >

//                   <option value="">

//                     Select Client

//                   </option>

//                   {clients.map((item) => (

//                     <option
//                       key={item._id}
//                       value={item._id}
//                     >

//                       {item.name}

//                     </option>

//                   ))}

//                 </select>

//               </div>


//               {/* -------------------------------- */}
//               {/* SERVICE */}
//               {/* -------------------------------- */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Service Type

//                 </label>

//                 <select
//                   value={serviceType}
//                   onChange={(e) =>
//                     setServiceType(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 >

//                   <option value="">

//                     Select Service

//                   </option>

//                   {services.map((service) => (

//                     <option
//                       key={service._id}
//                       value={service._id}
//                     >

//                       {service.name}

//                     </option>

//                   ))}

//                 </select>

//               </div>


//               {/* -------------------------------- */}
//               {/* ASSIGN USER */}
//               {/* -------------------------------- */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Assign To

//                 </label>

//                 <select
//                   value={assignedTo}
//                   onChange={(e) =>
//                     setAssignedTo(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 >

//                   <option value="">

//                     Select User

//                   </option>

//                   {teamMembers.map((member) => (

//                     <option
//                       key={member._id}
//                       value={member._id}
//                     >

//                       {member.name} ({member.role})

//                     </option>

//                   ))}

//                 </select>

//               </div>


//               {/* -------------------------------- */}
//               {/* PERIOD */}
//               {/* -------------------------------- */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Period

//                 </label>

//                 <input
//                   type="text"
//                   value={period}
//                   onChange={(e) =>
//                     setPeriod(e.target.value)
//                   }
//                   placeholder="Example: April 2026"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 />

//               </div>


//               {/* -------------------------------- */}
//               {/* START DATE */}
//               {/* -------------------------------- */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Start Date

//                 </label>

//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) =>
//                     setStartDate(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 />

//               </div>


//               {/* -------------------------------- */}
//               {/* DUE DATE */}
//               {/* -------------------------------- */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Due Date

//                 </label>

//                 <input
//                   type="date"
//                   value={dueDate}
//                   onChange={(e) =>
//                     setDueDate(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 />

//               </div>


//               {/* -------------------------------- */}
//               {/* BUTTON */}
//               {/* -------------------------------- */}

//               <div className="md:col-span-2">

//                 <button
//                   type="submit"
//                   disabled={creating}
//                   className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
//                 >

//                   {creating
//                     ? "Creating..."
//                     : "Create Engagement"}

//                 </button>

//               </div>

//             </form>

//           </div>


//           {/* -------------------------------- */}
//           {/* ENGAGEMENT TABLE */}
//           {/* -------------------------------- */}

//           <div className="bg-white rounded-lg shadow">

//             <div className="p-6 border-b">

//               <h2 className="text-lg font-semibold">

//                 All Engagements

//               </h2>

//             </div>


//             <div className="overflow-x-auto">

//               <table className="w-full">

//                 <thead className="bg-gray-50">

//                   <tr>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Client

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Service

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Assigned To

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Period

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Start Date

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Due Date

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Status

//                     </th>

//                   </tr>

//                 </thead>


//                 <tbody className="divide-y">

//                   {engagements.length === 0 ? (

//                     <tr>

//                       <td
//                         colSpan="7"
//                         className="px-6 py-8 text-center text-gray-500"
//                       >

//                         No engagements found

//                       </td>

//                     </tr>

//                   ) : (

//                     engagements.map((engagement) => (

//                       <tr
//                         key={engagement._id}
//                         className="hover:bg-gray-50"
//                       >

//                         {/* CLIENT */}

//                         <td className="px-6 py-4">

//                           {engagement.client?.name || "-"}

//                         </td>


//                         {/* SERVICE */}

//                         <td className="px-6 py-4">

//                           {engagement.serviceType?.name || "-"}

//                         </td>


//                         {/* ASSIGNED TO */}

//                         <td className="px-6 py-4">

//                           <div>

//                             <div className="font-medium">

//                               {engagement.assignedTo?.name || "-"}

//                             </div>

//                             <div className="text-sm text-gray-500">

//                               {engagement.assignedTo?.email || ""}

//                             </div>

//                             <div className="text-xs text-gray-400">

//                               {engagement.assignedTo?.role || ""}

//                             </div>

//                           </div>

//                         </td>


//                         {/* PERIOD */}

//                         <td className="px-6 py-4">

//                           {engagement.period || "-"}

//                         </td>


//                         {/* START DATE */}

//                         <td className="px-6 py-4">

//                           {engagement.startDate
//                             ? new Date(
//                                 engagement.startDate
//                               ).toLocaleDateString()
//                             : "-"}

//                         </td>


//                         {/* DUE DATE */}

//                         <td className="px-6 py-4">

//                           {engagement.dueDate
//                             ? new Date(
//                                 engagement.dueDate
//                               ).toLocaleDateString()
//                             : "-"}

//                         </td>


//                         {/* STATUS */}

//                         <td className="px-6 py-4">

//                           <span className="px-2 py-1 rounded text-sm bg-gray-100">

//                             {engagement.status || "NOT_STARTED"}

//                           </span>

//                         </td>

//                       </tr>

//                     ))

//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>

//   );
// };


// export default Engagement;


















// import { useEffect, useState } from "react";

// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// import { getClients } from "../api/clientApi";

// import { getServices } from "../api/serviceApi";

// import {
//   createEngagement,
//   getEngagements,
// } from "../api/engagementApi";

// import {
//   getAssignableUsers,
// } from "../api/userApi";


// const Engagement = () => {

//   // --------------------------------
//   // DATA
//   // --------------------------------

//   const [clients, setClients] = useState([]);

//   const [services, setServices] = useState([]);

//   const [teamMembers, setTeamMembers] = useState([]);

//   const [engagements, setEngagements] = useState([]);


//   // --------------------------------
//   // FORM
//   // --------------------------------

//   const [client, setClient] = useState("");

//   const [serviceType, setServiceType] = useState("");

//   const [assignedTo, setAssignedTo] = useState("");

//   const [period, setPeriod] = useState("");

//   const [startDate, setStartDate] = useState("");

//   const [dueDate, setDueDate] = useState("");


//   // --------------------------------
//   // STATES
//   // --------------------------------

//   const [loading, setLoading] = useState(true);

//   const [creating, setCreating] = useState(false);

//   const [error, setError] = useState("");

//   const [success, setSuccess] = useState("");


//   // --------------------------------
//   // FETCH DATA
//   // --------------------------------

//   const fetchData = async () => {

//     try {

//       setLoading(true);

//       setError("");

//       const [
//         clientsData,
//         servicesData,
//         teamMembersData,
//         engagementsData,
//       ] = await Promise.all([
//         getClients(),
//         getServices(),
//         getAssignableUsers(),
//         getEngagements(),
//       ]);


//       // CLIENTS

//       setClients(
//         clientsData.clients || []
//       );


//       // SERVICES

//       setServices(
//         servicesData.services || []
//       );


//       // TEAM MEMBERS

//       setTeamMembers(
//         teamMembersData.teamMembers || []
//       );


//       // ENGAGEMENTS

//       setEngagements(
//         engagementsData.engagements || []
//       );

//     } catch (error) {

//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to load data"
//       );

//     } finally {

//       setLoading(false);

//     }
//   };


//   // --------------------------------
//   // USE EFFECT
//   // --------------------------------

//   useEffect(() => {

//     fetchData();

//   }, []);


//   // --------------------------------
//   // CREATE ENGAGEMENT
//   // --------------------------------

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     setError("");

//     setSuccess("");


//     // VALIDATION

//     if (
//       !client ||
//       !serviceType ||
//       !assignedTo ||
//       !period ||
//       !startDate ||
//       !dueDate
//     ) {

//       setError(
//         "Please fill all fields"
//       );

//       return;
//     }


//     // DATE VALIDATION

//     if (
//       new Date(dueDate) <
//       new Date(startDate)
//     ) {

//       setError(
//         "Due date cannot be before start date"
//       );

//       return;
//     }


//     try {

//       setCreating(true);


//       // CREATE ENGAGEMENT

//       const data =
//         await createEngagement({

//           client,

//           serviceType,

//           assignedTo,

//           period,

//           startDate,

//           dueDate,

//         });


//       console.log(
//         "Created engagement:",
//         data
//       );


//       // SUCCESS

//       setSuccess(
//         "Engagement created successfully"
//       );


//       // RESET FORM

//       setClient("");

//       setServiceType("");

//       setAssignedTo("");

//       setPeriod("");

//       setStartDate("");

//       setDueDate("");


//       // REFRESH DATA

//       await fetchData();

//     } catch (error) {

//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to create engagement"
//       );

//     } finally {

//       setCreating(false);

//     }
//   };


//   // --------------------------------
//   // LOADING
//   // --------------------------------

//   if (loading) {

//     return (
//       <div className="flex">

//         <Sidebar />

//         <div className="flex-1">

//           <Navbar />

//           <div className="p-6">

//             Loading...

//           </div>

//         </div>

//       </div>
//     );
//   }


//   // --------------------------------
//   // UI
//   // --------------------------------

//   return (

//     <div className="flex min-h-screen bg-gray-100">

//       {/* SIDEBAR */}

//       <Sidebar />


//       {/* MAIN */}

//       <div className="flex-1">

//         <Navbar />


//         <div className="p-6">


//           {/* HEADER */}

//           <div className="mb-6">

//             <h1 className="text-2xl font-bold text-gray-800">

//               Engagements

//             </h1>

//             <p className="text-gray-500 mt-1">

//               Create and manage client engagements

//             </p>

//           </div>


//           {/* ERROR */}

//           {error && (

//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">

//               {error}

//             </div>

//           )}


//           {/* SUCCESS */}

//           {success && (

//             <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">

//               {success}

//             </div>

//           )}


//           {/* CREATE FORM */}

//           <div className="bg-white rounded-lg shadow p-6 mb-8">

//             <h2 className="text-lg font-semibold mb-5">

//               Create Engagement

//             </h2>


//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-5"
//             >


//               {/* CLIENT */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Client

//                 </label>

//                 <select
//                   value={client}
//                   onChange={(e) =>
//                     setClient(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 >

//                   <option value="">

//                     Select Client

//                   </option>

//                   {clients.map((item) => (

//                     <option
//                       key={item._id}
//                       value={item._id}
//                     >

//                       {item.name}

//                     </option>

//                   ))}

//                 </select>

//               </div>


//               {/* SERVICE */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Service Type

//                 </label>

//                 <select
//                   value={serviceType}
//                   onChange={(e) =>
//                     setServiceType(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 >

//                   <option value="">

//                     Select Service

//                   </option>

//                   {services.map((service) => (

//                     <option
//                       key={service._id}
//                       value={service._id}
//                     >

//                       {service.name}

//                     </option>

//                   ))}

//                 </select>

//               </div>


//               {/* TEAM MEMBER */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Assign Team Member

//                 </label>

//                 <select
//                   value={assignedTo}
//                   onChange={(e) =>
//                     setAssignedTo(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 >

//                   <option value="">

//                     Select Team Member

//                   </option>

//                   {teamMembers.map((member) => (

//                     <option
//                       key={member._id}
//                       value={member._id}
//                     >

//                       {member.name} - {member.email}

//                     </option>

//                   ))}

//                 </select>

//               </div>


//               {/* PERIOD */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Period

//                 </label>

//                 <input
//                   type="text"
//                   value={period}
//                   onChange={(e) =>
//                     setPeriod(e.target.value)
//                   }
//                   placeholder="Example: April 2026"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 />

//               </div>


//               {/* START DATE */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Start Date

//                 </label>

//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) =>
//                     setStartDate(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 />

//               </div>


//               {/* DUE DATE */}

//               <div>

//                 <label className="block text-sm font-medium text-gray-700 mb-1">

//                   Due Date

//                 </label>

//                 <input
//                   type="date"
//                   value={dueDate}
//                   onChange={(e) =>
//                     setDueDate(e.target.value)
//                   }
//                   className="w-full border border-gray-300 rounded-md px-3 py-2"
//                 />

//               </div>


//               {/* BUTTON */}

//               <div className="md:col-span-2">

//                 <button
//                   type="submit"
//                   disabled={creating}
//                   className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
//                 >

//                   {creating
//                     ? "Creating..."
//                     : "Create Engagement"}

//                 </button>

//               </div>

//             </form>

//           </div>


//           {/* ENGAGEMENT TABLE */}

//           <div className="bg-white rounded-lg shadow">

//             <div className="p-6 border-b">

//               <h2 className="text-lg font-semibold">

//                 All Engagements

//               </h2>

//             </div>


//             <div className="overflow-x-auto">

//               <table className="w-full">

//                 <thead className="bg-gray-50">

//                   <tr>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Client

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Service

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Assigned To

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Period

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Start Date

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Due Date

//                     </th>

//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">

//                       Status

//                     </th>

//                   </tr>

//                 </thead>


//                 <tbody className="divide-y">

//                   {engagements.length === 0 ? (

//                     <tr>

//                       <td
//                         colSpan="7"
//                         className="px-6 py-8 text-center text-gray-500"
//                       >

//                         No engagements found

//                       </td>

//                     </tr>

//                   ) : (

//                     engagements.map((engagement) => (

//                       <tr
//                         key={engagement._id}
//                         className="hover:bg-gray-50"
//                       >


//                         {/* CLIENT */}

//                         <td className="px-6 py-4">

//                           {engagement.client?.name || "-"} 

//                         </td>


//                         {/* SERVICE */}

//                         <td className="px-6 py-4">

//                           {engagement.serviceType?.name || "-"}

//                         </td>


//                         {/* ASSIGNED MEMBER */}

//                         <td className="px-6 py-4">

//                           <div>

//                             <div className="font-medium">

//                               {engagement.assignedTo?.name || "-"}

//                             </div>

//                             <div className="text-sm text-gray-500">

//                               {engagement.assignedTo?.email || ""}

//                             </div>

//                           </div>

//                         </td>


//                         {/* PERIOD */}

//                         <td className="px-6 py-4">

//                           {engagement.period}

//                         </td>


//                         {/* START DATE */}

//                         <td className="px-6 py-4">

//                           {engagement.startDate
//                             ? new Date(
//                                 engagement.startDate
//                               ).toLocaleDateString()
//                             : "-"}

//                         </td>


//                         {/* DUE DATE */}

//                         <td className="px-6 py-4">

//                           {engagement.dueDate
//                             ? new Date(
//                                 engagement.dueDate
//                               ).toLocaleDateString()
//                             : "-"}

//                         </td>


//                         {/* STATUS */}

//                         <td className="px-6 py-4">

//                           <span className="px-2 py-1 rounded text-sm bg-gray-100">

//                             {engagement.status}

//                           </span>

//                         </td>

//                       </tr>

//                     ))

//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>

//   );
// };


// export default Engagement;






