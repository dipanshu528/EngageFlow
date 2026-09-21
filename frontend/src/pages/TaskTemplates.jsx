import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { getServices } from "../api/serviceApi";

import {
  createTaskTemplate,
  getTaskTemplates,
  updateTaskTemplate,
} from "../api/taskTemplateApi";

import {
  getAssignableUsers,
} from "../api/userApi";


const TaskTemplates = () => {

  // ========================================
  // LOGGED-IN USER
  // ========================================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // ========================================
  // DATA STATES
  // ========================================

  const [services, setServices] =
    useState([]);

  const [templates, setTemplates] =
    useState([]);

  const [teamMembers, setTeamMembers] =
    useState([]);


  // ========================================
  // CREATE FORM STATES
  // ========================================

  const [serviceType, setServiceType] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [order, setOrder] =
    useState(1);

  const [estimatedDays, setEstimatedDays] =
    useState(1);


  // ========================================
  // LOADING STATES
  // ========================================

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [reassignLoading, setReassignLoading] =
    useState(false);


  // ========================================
  // MESSAGE STATES
  // ========================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ========================================
  // REASSIGN STATES
  // ========================================

  const [reassignTemplate, setReassignTemplate] =
    useState(null);

  const [reassignUser, setReassignUser] =
    useState("");


  // ========================================
  // FETCH DATA
  // ========================================

  const fetchData = async () => {

    try {

      setFetching(true);
      setError("");

      const [
        servicesData,
        templatesData,
        usersData,
      ] = await Promise.all([

        getServices(),

        getTaskTemplates(),

        getAssignableUsers(),

      ]);


      setServices(
        servicesData.services || []
      );


      setTemplates(
        templatesData.templates || []
      );


      setTeamMembers(
        usersData.users || []
      );


      console.log(
        "ASSIGNABLE USERS:",
        usersData.users
      );

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load task templates"
      );

    } finally {

      setFetching(false);

    }
  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    fetchData();

  }, []);


  // ========================================
  // CREATE TASK TEMPLATE
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Service validation
    if (!serviceType) {

      setError(
        "Please select a service"
      );

      return;
    }


    // Title validation
    if (!title.trim()) {

      setError(
        "Task title is required"
      );

      return;
    }


    // User validation
    if (!assignedTo) {

      setError(
        "Please select a user"
      );

      return;
    }


    // Order validation
    if (Number(order) < 1) {

      setError(
        "Order must be at least 1"
      );

      return;
    }


    // Estimated days validation
    if (Number(estimatedDays) < 1) {

      setError(
        "Estimated days must be at least 1"
      );

      return;
    }


    try {

      setLoading(true);


      const data =
        await createTaskTemplate({

          serviceType,

          title,

          description,

          order: Number(order),

          estimatedDays:
            Number(estimatedDays),

          assignedTo,

        });


      // Add newly created template
      setTemplates(
        (prevTemplates) => [
          data.template,
          ...prevTemplates,
        ]
      );


      setSuccess(
        "Task template created successfully"
      );


      // Reset form
      setServiceType("");
      setTitle("");
      setAssignedTo("");
      setDescription("");
      setOrder(1);
      setEstimatedDays(1);


    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create task template"
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // OPEN REASSIGN MODAL
  // ========================================

  const handleReassign = (template) => {

    setReassignTemplate(template);

    setReassignUser(
      template.assignedTo?._id || ""
    );

    setError("");
    setSuccess("");
  };


  // ========================================
  // CLOSE REASSIGN MODAL
  // ========================================

  const closeReassignModal = () => {

    setReassignTemplate(null);

    setReassignUser("");

  };


  // ========================================
  // REASSIGN TASK TEMPLATE
  // ========================================

  const handleReassignSubmit = async () => {

    if (!reassignUser) {

      setError(
        "Please select a user"
      );

      return;
    }


    if (!reassignTemplate) {

      return;
    }


    try {

      setReassignLoading(true);

      setError("");
      setSuccess("");


      await updateTaskTemplate(
        reassignTemplate._id,
        {
          assignedTo: reassignUser,
        }
      );


      // Fetch again so assignedTo
      // comes populated with name/email/role
      const templatesData =
        await getTaskTemplates();


      setTemplates(
        templatesData.templates || []
      );


      setSuccess(
        "Task template reassigned successfully"
      );


      // Close modal
      setReassignTemplate(null);

      setReassignUser("");


    } catch (error) {

      console.error(
        "REASSIGN ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to reassign task template"
      );

    } finally {

      setReassignLoading(false);

    }
  };


  return (

    <div className="flex min-h-screen bg-slate-50">

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <Sidebar />


      <div className="flex-1">

        {/* ========================================
            NAVBAR
        ======================================== */}

        <Navbar />


        <main className="p-6">


          {/* ========================================
              HEADER
          ======================================== */}

          <div className="mb-6">

            <h1 className="text-2xl font-bold text-slate-800">
              Task Templates
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Define tasks and assign them to team members.
            </p>

          </div>


          {/* ========================================
              ERROR MESSAGE
          ======================================== */}

          {error && (

            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">

              {error}

            </div>

          )}


          {/* ========================================
              SUCCESS MESSAGE
          ======================================== */}

          {success && (

            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">

              {success}

            </div>

          )}


          {/* ========================================
              CREATE TEMPLATE
          ======================================== */}

          {user?.role === "ADMIN" && (

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">

              <h2 className="text-lg font-semibold text-slate-800 mb-5">

                Create Task Template

              </h2>


              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >


                {/* SERVICE */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Service

                  </label>


                  <select
                    value={serviceType}
                    onChange={(e) =>
                      setServiceType(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
                  >

                    <option value="">
                      Select service
                    </option>


                    {services.map(
                      (service) => (

                        <option
                          key={service._id}
                          value={service._id}
                        >

                          {service.name}

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* TASK TITLE */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Task Title

                  </label>


                  <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    placeholder="Enter task title"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
                  />

                </div>


                {/* ASSIGN TO */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Assign To

                  </label>


                  <select
                    value={assignedTo}
                    onChange={(e) =>
                      setAssignedTo(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-slate-400"
                  >

                    <option value="">
                      Select user
                    </option>


                    {teamMembers.map(
                      (member) => (

                        <option
                          key={member._id}
                          value={member._id}
                        >

                          {member.name} (
                          {member.role}
                          )

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Description

                  </label>


                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    placeholder="Enter task description"
                    rows="3"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                  />

                </div>


                {/* ORDER */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Order

                  </label>


                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) =>
                      setOrder(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
                  />

                </div>


                {/* ESTIMATED DAYS */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Estimated Days

                  </label>


                  <input
                    type="number"
                    min="1"
                    value={estimatedDays}
                    onChange={(e) =>
                      setEstimatedDays(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
                  />

                </div>


                {/* SUBMIT */}

                <div className="md:col-span-2">

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                  >

                    {loading
                      ? "Creating..."
                      : "Create Task Template"}

                  </button>

                </div>

              </form>

            </div>

          )}


          {/* ========================================
              EXISTING TASK TEMPLATES
          ======================================== */}

          <div className="bg-white rounded-xl border border-slate-200">


            {/* HEADER */}

            <div className="p-6 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-800">

                Existing Task Templates

              </h2>

            </div>


            {/* LOADING */}

            {fetching ? (

              <div className="p-6 text-sm text-slate-500">

                Loading task templates...

              </div>


            ) : templates.length === 0 ? (

              /* EMPTY */

              <div className="p-6 text-sm text-slate-500">

                No task templates found.

              </div>


            ) : (

              /* TABLE */

              <div className="overflow-x-auto">

                <table className="w-full">


                  {/* TABLE HEADER */}

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">

                        Order

                      </th>


                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">

                        Task

                      </th>


                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">

                        Service

                      </th>


                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">

                        Assign To

                      </th>


                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">

                        Estimated Days

                      </th>


                      <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">

                        Status

                      </th>

                    </tr>

                  </thead>


                  {/* TABLE BODY */}

                  <tbody>

                    {templates.map(
                      (template) => (

                        <tr
                          key={template._id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >


                          {/* ORDER */}

                          <td className="px-6 py-4 text-sm text-slate-700">

                            {template.order}

                          </td>


                          {/* TASK */}

                          <td className="px-6 py-4 min-w-[250px]">

                            <p className="font-medium text-slate-800">

                              {template.title}

                            </p>


                            {template.description && (

                              <p className="text-xs text-slate-500 mt-1">

                                {template.description}

                              </p>

                            )}

                          </td>


                          {/* SERVICE */}

                          <td className="px-6 py-4 text-sm text-slate-700 min-w-[180px]">

                            {template.serviceType?.name ||
                              "Unknown Service"}

                          </td>


                          {/* ASSIGN TO */}

                          <td className="px-6 py-4 text-sm text-slate-700 min-w-[280px]">

                            {template.assignedTo ? (

                              <div className="flex items-center justify-between gap-4">

                                <div>

                                  <p className="font-medium text-slate-800">

                                    {template.assignedTo.name}

                                  </p>


                                  <p className="text-xs text-slate-500">

                                    {template.assignedTo.role}

                                  </p>

                                </div>


                                {user?.role ===
                                  "ADMIN" && (

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleReassign(
                                        template
                                      )
                                    }
                                    className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100"
                                  >

                                    Reassign

                                  </button>

                                )}

                              </div>

                            ) : (

                              <button
                                type="button"
                                onClick={() =>
                                  handleReassign(
                                    template
                                  )
                                }
                                className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700"
                              >

                                Assign

                              </button>

                            )}

                          </td>


                          {/* ESTIMATED DAYS */}

                          <td className="px-6 py-4 text-sm text-slate-700 min-w-[130px]">

                            {template.estimatedDays} day
                            {template.estimatedDays !==
                            1
                              ? "s"
                              : ""}

                          </td>


                          {/* STATUS */}

                          <td className="px-6 py-4 min-w-[100px]">

                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                template.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >

                              {template.isActive
                                ? "Active"
                                : "Inactive"}

                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>


          {/* ========================================
              REASSIGN MODAL
          ======================================== */}

          {reassignTemplate && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">


              <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">


                {/* MODAL HEADER */}

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <h2 className="text-lg font-semibold text-slate-800">

                      Reassign Task Template

                    </h2>


                    <p className="text-sm text-slate-500 mt-1">

                      {reassignTemplate.title}

                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={
                      closeReassignModal
                    }
                    disabled={
                      reassignLoading
                    }
                    className="text-slate-400 hover:text-slate-700 text-xl"
                  >

                    ×

                  </button>

                </div>


                {/* CURRENT ASSIGNMENT */}

                <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">

                  <p className="text-xs text-slate-500">

                    Currently assigned to

                  </p>


                  <p className="text-sm font-medium text-slate-800 mt-1">

                    {reassignTemplate.assignedTo?.name ||
                      "Not assigned"}

                  </p>

                </div>


                {/* NEW USER */}

                <div className="mb-5">

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Assign To

                  </label>


                  <select
                    value={reassignUser}
                    onChange={(e) =>
                      setReassignUser(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-slate-400"
                  >

                    <option value="">
                      Select user
                    </option>


                    {teamMembers.map(
                      (member) => (

                        <option
                          key={member._id}
                          value={member._id}
                        >

                          {member.name} (
                          {member.role}
                          )

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* BUTTONS */}

                <div className="flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={
                      closeReassignModal
                    }
                    disabled={
                      reassignLoading
                    }
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >

                    Cancel

                  </button>


                  <button
                    type="button"
                    onClick={
                      handleReassignSubmit
                    }
                    disabled={
                      reassignLoading
                    }
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
                  >

                    {reassignLoading
                      ? "Saving..."
                      : "Save"}

                  </button>

                </div>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
};


export default TaskTemplates;




// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// import { getServices } from "../api/serviceApi";

// import {
//   createTaskTemplate,
//   getTaskTemplates,
// } from "../api/taskTemplateApi";

// import {
//   getAssignableUsers,
// } from "../api/userApi";


// const TaskTemplates = () => {
//   // Get logged-in user
//   const user = JSON.parse(localStorage.getItem("user"));

//   const [services, setServices] = useState([]);
//   const [templates, setTemplates] = useState([]);
//   const [teamMembers, setTeamMembers] = useState([]);

//   const [serviceType, setServiceType] = useState("");
//   const [title, setTitle] = useState("");
//   const [assignedTo, setAssignedTo] = useState("");
//   const [description, setDescription] = useState("");
//   const [order, setOrder] = useState(1);
//   const [estimatedDays, setEstimatedDays] = useState(1);

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");


//   // Fetch services, users and templates
//   const fetchData = async () => {
//     try {
//       setFetching(true);
//       setError("");

//       const [
//         servicesData,
//         templatesData,
//         usersData,
//       ] = await Promise.all([
//         getServices(),
//         getTaskTemplates(),
//         getAssignableUsers(),
//       ]);

//       setServices(servicesData.services || []);

//       setTemplates(templatesData.templates || []);

//       setTeamMembers(usersData.users || []);

//       console.log("ASSIGNABLE USERS:", usersData.users);

//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to load task templates"
//       );
//     } finally {
//       setFetching(false);
//     }
//   };


//   useEffect(() => {
//     fetchData();
//   }, []);


//   // Create task template
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");


//     if (!serviceType) {
//       setError("Please select a service");
//       return;
//     }


//     if (!title.trim()) {
//       setError("Task title is required");
//       return;
//     }


//     if (!assignedTo) {
//       setError("Please select a user");
//       return;
//     }


//     if (order < 1) {
//       setError("Order must be at least 1");
//       return;
//     }


//     if (estimatedDays < 1) {
//       setError("Estimated days must be at least 1");
//       return;
//     }


//     try {
//       setLoading(true);


//       const data = await createTaskTemplate({
//         serviceType,
//         title,
//         description,
//         order: Number(order),
//         estimatedDays: Number(estimatedDays),
//         assignedTo,
//       });


//       setTemplates((prevTemplates) => [
//         data.template,
//         ...prevTemplates,
//       ]);


//       setSuccess(
//         "Task template created successfully"
//       );


//       // Reset form
//       setServiceType("");
//       setTitle("");
//       setAssignedTo("");
//       setDescription("");
//       setOrder(1);
//       setEstimatedDays(1);

//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to create task template"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="flex min-h-screen bg-slate-50">

//       <Sidebar />

//       <div className="flex-1">

//         <Navbar />

//         <main className="p-6">

//           {/* Header */}
//           <div className="mb-6">

//             <h1 className="text-2xl font-bold text-slate-800">
//               Task Templates
//             </h1>

//           </div>


//           {/* Messages */}

//           {error && (
//             <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}


//           {success && (
//             <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
//               {success}
//             </div>
//           )}


//           {/* CREATE TEMPLATE */}

//           {user?.role === "ADMIN" && (

//             <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">

//               <h2 className="text-lg font-semibold text-slate-800 mb-5">
//                 Create Task Template
//               </h2>


//               <form
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-5"
//               >


//                 {/* Service */}

//                 <div>

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Service
//                   </label>

//                   <select
//                     value={serviceType}
//                     onChange={(e) =>
//                       setServiceType(e.target.value)
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                   >

//                     <option value="">
//                       Select service
//                     </option>

//                     {services.map((service) => (

//                       <option
//                         key={service._id}
//                         value={service._id}
//                       >
//                         {service.name}
//                       </option>

//                     ))}

//                   </select>

//                 </div>


//                 {/* Task Title */}

//                 <div>

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Task Title
//                   </label>

//                   <input
//                     type="text"
//                     value={title}
//                     onChange={(e) =>
//                       setTitle(e.target.value)
//                     }
//                     placeholder="Enter task title"
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                   />

//                 </div>


//                 {/* Assign To */}

//                 <div>

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Assign To
//                   </label>

//                   <select
//                     value={assignedTo}
//                     onChange={(e) =>
//                       setAssignedTo(e.target.value)
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-slate-400"
//                   >

//                     <option value="">
//                       Select user
//                     </option>

//                     {teamMembers.map((member) => (

//                       <option
//                         key={member._id}
//                         value={member._id}
//                       >
//                         {member.name} ({member.role})
//                       </option>

//                     ))}

//                   </select>

//                 </div>


//                 {/* Description */}

//                 <div className="md:col-span-2">

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Description
//                   </label>

//                   <textarea
//                     value={description}
//                     onChange={(e) =>
//                       setDescription(e.target.value)
//                     }
//                     placeholder="Enter task description"
//                     rows="3"
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 resize-none"
//                   />

//                 </div>


//                 {/* Order */}

//                 <div>

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Order
//                   </label>

//                   <input
//                     type="number"
//                     min="1"
//                     value={order}
//                     onChange={(e) =>
//                       setOrder(e.target.value)
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                   />

//                 </div>


//                 {/* Estimated Days */}

//                 <div>

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Estimated Days
//                   </label>

//                   <input
//                     type="number"
//                     min="1"
//                     value={estimatedDays}
//                     onChange={(e) =>
//                       setEstimatedDays(e.target.value)
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                   />

//                 </div>


//                 {/* Submit */}

//                 <div className="md:col-span-2">

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 disabled:opacity-50"
//                   >

//                     {loading
//                       ? "Creating..."
//                       : "Create Task Template"}

//                   </button>

//                 </div>

//               </form>

//             </div>

//           )}


//           {/* Template List */}

//           <div className="bg-white rounded-xl border border-slate-200">

//             <div className="p-6 border-b border-slate-200">

//               <h2 className="text-lg font-semibold text-slate-800">
//                 Existing Task Templates
//               </h2>

//             </div>


//             {fetching ? (

//               <div className="p-6 text-sm text-slate-500">
//                 Loading task templates...
//               </div>

//             ) : templates.length === 0 ? (

//               <div className="p-6 text-sm text-slate-500">
//                 No task templates found.
//               </div>

//             ) : (

//               <div className="overflow-x-auto">

//                 <table className="w-full">

//                   <thead className="bg-slate-50">

//                     <tr>

//                       {/* Order */}

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Order
//                       </th>


//                       {/* Task */}

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Task
//                       </th>


//                       {/* Service */}

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Service
//                       </th>


//                       {/* Assign To */}

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Assign To
//                       </th>


//                       {/* Estimated Days */}

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Estimated Days
//                       </th>


//                       {/* Status */}

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Status
//                       </th>

//                     </tr>

//                   </thead>


//                   <tbody>

//                     {templates.map((template) => (

//                       <tr
//                         key={template._id}
//                         className="border-t border-slate-100 hover:bg-slate-50"
//                       >

//                         {/* Order */}

//                         <td className="px-6 py-4 text-sm text-slate-700">
//                           {template.order}
//                         </td>


//                         {/* Task */}

//                         <td className="px-6 py-4 min-w-[250px]">

//                           <p className="font-medium text-slate-800">
//                             {template.title}
//                           </p>

//                           {template.description && (

//                             <p className="text-xs text-slate-500 mt-1">
//                               {template.description}
//                             </p>

//                           )}

//                         </td>


//                         {/* Service */}

//                         <td className="px-6 py-4 text-sm text-slate-700 min-w-[180px]">

//                           {template.serviceType?.name ||
//                             "Unknown Service"}

//                         </td>


//                         {/* Assign To */}

//                         <td className="px-6 py-4 text-sm text-slate-700 min-w-[180px]">

//                           {template.assignedTo ? (

//                             <div>

//                               <p className="font-medium text-slate-800">
//                                 {template.assignedTo.name}
//                               </p>

//                               <p className="text-xs text-slate-500">
//                                 {template.assignedTo.role}
//                               </p>

//                             </div>

//                           ) : (

//                             <span className="text-slate-400">
//                               Not assigned
//                             </span>

//                           )}

//                         </td>


//                         {/* Estimated Days */}

//                         <td className="px-6 py-4 text-sm text-slate-700 min-w-[130px]">

//                           {template.estimatedDays} day
//                           {template.estimatedDays !== 1
//                             ? "s"
//                             : ""}

//                         </td>


//                         {/* Status */}

//                         <td className="px-6 py-4 min-w-[100px]">

//                           <span
//                             className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
//                               template.isActive
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >

//                             {template.isActive
//                               ? "Active"
//                               : "Inactive"}

//                           </span>

//                         </td>

//                       </tr>

//                     ))}

//                   </tbody>

//                 </table>

//               </div>

//             )}

//           </div>

//         </main>

//       </div>

//     </div>
//   );
// };


// export default TaskTemplates;













// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// import { getServices } from "../api/serviceApi";
// import {
//   createTaskTemplate,
//   getTaskTemplates,
// } from "../api/taskTemplateApi";

// import {
//   getAssignableUsers,
// } from "../api/userApi";


// const TaskTemplates = () => {
//   // Get logged-in user
//   const user = JSON.parse(localStorage.getItem("user"));

//   const [services, setServices] = useState([]);
//   const [templates, setTemplates] = useState([]);

//   const [serviceType, setServiceType] = useState("");
//   const [title, setTitle] = useState("");
//   const [assignedTo, setAssignedTo] = useState("");
//   const [description, setDescription] = useState("");
//   const [order, setOrder] = useState(1);
//   const [estimatedDays, setEstimatedDays] = useState(1);

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch services and templates
//   const fetchData = async () => {
//     try {
//       setFetching(true);
//       setError("");

//       const [servicesData, templatesData] = await Promise.all([
//         getServices(),
//         getTaskTemplates(),
//       ]);

//       setServices(servicesData.services || []);
//       setTemplates(templatesData.templates || []);
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to load task templates"
//       );
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Create task template
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!serviceType) {
//       setError("Please select a service");
//       return;
//     }

//     if (!title.trim()) {
//       setError("Task title is required");
//       return;
//     }

//     if (order < 1) {
//       setError("Order must be at least 1");
//       return;
//     }

//     if (estimatedDays < 1) {
//       setError("Estimated days must be at least 1");
//       return;
//     }

//     try {
//       setLoading(true);

//       const data = await createTaskTemplate({
//         serviceType,
//         title,
//         description,
//         order: Number(order),
//         estimatedDays: Number(estimatedDays),
//       });

//       setTemplates((prevTemplates) => [
//         data.template,
//         ...prevTemplates,
//       ]);

//       setSuccess("Task template created successfully");

//       // Reset form
//       setServiceType("");
//       setTitle("");
//       setDescription("");
//       setOrder(1);
//       setEstimatedDays(1);
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to create task template"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />

//       <div className="flex-1">
//         <Navbar />

//         <main className="p-6">
//           {/* Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-slate-800">
//               Task Templates
//             </h1>

//             {/* <p className="text-sm text-slate-500 mt-1">
//               Create reusable tasks for your services.
//             </p> */}
//           </div>

//           {/* Messages */}
//           {error && (
//             <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
//               {success}
//             </div>
//           )}

//           {/* 
//             CREATE TEMPLATE FORM
//             Only ADMIN can see this section.
//             MANAGER and TEAM_MEMBER will not see it.
//           */}
//           {user?.role === "ADMIN" && (
//             <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
//               <h2 className="text-lg font-semibold text-slate-800 mb-5">
//                 Create Task Template
//               </h2>

//               <form
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-5"
//               >
//                 {/* Service */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Service
//                   </label>

//                   <select
//                     value={serviceType}
//                     onChange={(e) =>
//                       setServiceType(e.target.value)
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                   >
//                     <option value="">Select service</option>

//                     {services.map((service) => (
//                       <option
//                         key={service._id}
//                         value={service._id}
//                       >
//                         {service.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Task Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Task Title
//                   </label>

//                   <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Enter task title"
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                   />
//                 </div>

//                 {/* Description */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Description
//                   </label>

//                   <textarea
//                     value={description}
//                     onChange={(e) =>
//                       setDescription(e.target.value)
//                     }
//                     placeholder="Enter task description"
//                     rows="3"
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 resize-none"
//                   />
//                 </div>

              

//                 {/* Order */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Order
//                   </label>

//                   <input
//                     type="number"
//                     min="1"
//                     value={order}
//                     onChange={(e) => setOrder(e.target.value)}
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                   />
//                 </div>

//                 {/* Estimated Days */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Estimated Days
//                   </label>

//                   <input
//                     type="number"
//                     min="1"
//                     value={estimatedDays}
//                     onChange={(e) =>
//                       setEstimatedDays(e.target.value)
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                   />
//                 </div>

//                 {/* Submit */}
//                 <div className="md:col-span-2">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 disabled:opacity-50"
//                   >
//                     {loading
//                       ? "Creating..."
//                       : "Create Task Template"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* Template List */}
//           <div className="bg-white rounded-xl border border-slate-200">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-lg font-semibold text-slate-800">
//                 Existing Task Templates
//               </h2>
//             </div>

//             {fetching ? (
//               <div className="p-6 text-sm text-slate-500">
//                 Loading task templates...
//               </div>
//             ) : templates.length === 0 ? (
//               <div className="p-6 text-sm text-slate-500">
//                 No task templates found.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-50">
//                     <tr>
//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Order
//                       </th>

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Task
//                       </th>

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Service
//                       </th>


//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Estimated Days
//                       </th>

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {templates.map((template) => (
//                       <tr
//                         key={template._id}
//                         className="border-t border-slate-100 hover:bg-slate-50"
//                       >
//                         {/* Order */}
//                         <td className="px-6 py-4 text-sm text-slate-700">
//                           {template.order}
//                         </td>

//                         {/* Task */}
//                         <td className="px-6 py-4 min-w-[250px]">
//                           <p className="font-medium text-slate-800">
//                             {template.title}
//                           </p>

//                           {template.description && (
//                             <p className="text-xs text-slate-500 mt-1">
//                               {template.description}
//                             </p>
//                           )}
//                         </td>

//                         {/* Service */}
//                         <td className="px-6 py-4 text-sm text-slate-700 min-w-[180px]">
//                           {template.serviceType?.name ||
//                             "Unknown Service"}
//                         </td>

                       

//                         {/* Estimated Days */}
//                         <td className="px-6 py-4 text-sm text-slate-700 min-w-[130px]">
//                           {template.estimatedDays} day
//                           {template.estimatedDays !== 1
//                             ? "s"
//                             : ""}
//                         </td>

//                         {/* Status */}
//                         <td className="px-6 py-4 min-w-[100px]">
//                           <span
//                             className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
//                               template.isActive
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-red-100 text-red-700"
//                             }`}
//                           >
//                             {template.isActive
//                               ? "Active"
//                               : "Inactive"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default TaskTemplates;














// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// import { getServices } from "../api/serviceApi";
// import {
//   createTaskTemplate,
//   getTaskTemplates,
// } from "../api/taskTemplateApi";

// const TaskTemplates = () => {
//   const [services, setServices] = useState([]);
//   const [templates, setTemplates] = useState([]);

//   const [serviceType, setServiceType] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [defaultAssigneeRole, setDefaultAssigneeRole] =
//     useState("TEAM_MEMBER");
//   const [order, setOrder] = useState(1);
//   const [estimatedDays, setEstimatedDays] = useState(1);

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch services and templates
//   const fetchData = async () => {
//     try {
//       setFetching(true);
//       setError("");

//       const [servicesData, templatesData] = await Promise.all([
//         getServices(),
//         getTaskTemplates(),
//       ]);

//       setServices(servicesData.services || []);
//       setTemplates(templatesData.templates || []);
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to load task templates"
//       );
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Create task template
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!serviceType) {
//       setError("Please select a service");
//       return;
//     }

//     if (!title.trim()) {
//       setError("Task title is required");
//       return;
//     }

//     if (order < 1) {
//       setError("Order must be at least 1");
//       return;
//     }

//     if (estimatedDays < 1) {
//       setError("Estimated days must be at least 1");
//       return;
//     }

//     try {
//       setLoading(true);

//       const data = await createTaskTemplate({
//         serviceType,
//         title,
//         description,
//         defaultAssigneeRole,
//         order: Number(order),
//         estimatedDays: Number(estimatedDays),
//       });

//       setTemplates((prevTemplates) => [
//         data.template,
//         ...prevTemplates,
//       ]);

//       setSuccess("Task template created successfully");

//       // Reset form
//       setServiceType("");
//       setTitle("");
//       setDescription("");
//       setDefaultAssigneeRole("TEAM_MEMBER");
//       setOrder(1);
//       setEstimatedDays(1);
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to create task template"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />

//       <div className="flex-1">
//         <Navbar />

//         <main className="p-6">
//           {/* Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-slate-800">
//               Task Templates
//             </h1>

//             <p className="text-sm text-slate-500 mt-1">
//               Create reusable tasks for your services.
//             </p>
//           </div>

//           {/* Messages */}
//           {error && (
//             <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
//               {success}
//             </div>
//           )}

//           {/* Create Template Form */}
//           <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
//             <h2 className="text-lg font-semibold text-slate-800 mb-5">
//               Create Task Template
//             </h2>

//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-5"
//             >
//               {/* Service */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Service
//                 </label>

//                 <select
//                   value={serviceType}
//                   onChange={(e) => setServiceType(e.target.value)}
//                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                 >
//                   <option value="">Select service</option>

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

//               {/* Task Title */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Task Title
//                 </label>

//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter task title"
//                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                 />
//               </div>

//               {/* Description */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Description
//                 </label>

//                 <textarea
//                   value={description}
//                   onChange={(e) =>
//                     setDescription(e.target.value)
//                   }
//                   placeholder="Enter task description"
//                   rows="3"
//                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400 resize-none"
//                 />
//               </div>

//               {/* Assignee Role */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Default Assignee Role
//                 </label>

//                 <select
//                   value={defaultAssigneeRole}
//                   onChange={(e) =>
//                     setDefaultAssigneeRole(e.target.value)
//                   }
//                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                 >
//                   <option value="TEAM_MEMBER">
//                     Team Member
//                   </option>

//                   <option value="MANAGER">
//                     Manager
//                   </option>
//                 </select>
//               </div>

//               {/* Order */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Order
//                 </label>

//                 <input
//                   type="number"
//                   min="1"
//                   value={order}
//                   onChange={(e) => setOrder(e.target.value)}
//                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                 />
//               </div>

//               {/* Estimated Days */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Estimated Days
//                 </label>

//                 <input
//                   type="number"
//                   min="1"
//                   value={estimatedDays}
//                   onChange={(e) =>
//                     setEstimatedDays(e.target.value)
//                   }
//                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-400"
//                 />
//               </div>

//               {/* Submit */}
//               <div className="md:col-span-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 disabled:opacity-50"
//                 >
//                   {loading
//                     ? "Creating..."
//                     : "Create Task Template"}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Template List */}
//           <div className="bg-white rounded-xl border border-slate-200">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-lg font-semibold text-slate-800">
//                 Existing Task Templates
//               </h2>
//             </div>

//             {fetching ? (
//               <div className="p-6 text-sm text-slate-500">
//                 Loading task templates...
//               </div>
//             ) : templates.length === 0 ? (
//               <div className="p-6 text-sm text-slate-500">
//                 No task templates found.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-50">
//                     <tr>
//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Order
//                       </th>

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Task
//                       </th>

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Service
//                       </th>

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Assignee
//                       </th>

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Estimated Days
//                       </th>

//                       <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>

//                  <tbody>
//   {templates.map((template) => (
//     <tr
//       key={template._id}
//       className="border-t border-slate-100 hover:bg-slate-50"
//     >
//       {/* Order */}
//       <td className="px-6 py-4 text-sm text-slate-700">
//         {template.order}
//       </td>

//       {/* Task */}
//       <td className="px-6 py-4 min-w-[250px]">
//         <p className="font-medium text-slate-800">
//           {template.title}
//         </p>

//         {template.description && (
//           <p className="text-xs text-slate-500 mt-1">
//             {template.description}
//           </p>
//         )}
//       </td>

//       {/* Service */}
//       <td className="px-6 py-4 text-sm text-slate-700 min-w-[180px]">
//         {template.serviceType?.name || "Unknown Service"}
//       </td>

//       {/* Assignee */}
//       <td className="px-6 py-4 text-sm text-slate-700 min-w-[130px]">
//         {template.defaultAssigneeRole === "TEAM_MEMBER"
//           ? "Team Member"
//           : "Manager"}
//       </td>

//       {/* Estimated Days */}
//       <td className="px-6 py-4 text-sm text-slate-700 min-w-130]">
//         {template.estimatedDays} day
//         {template.estimatedDays !== 1 ? "s" : ""}
//       </td>

//       {/* Status */}
//       <td className="px-6 py-4 min-w-[100px]">
//         <span
//           className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
//             template.isActive
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {template.isActive ? "Active" : "Inactive"}
//         </span>
//       </td>
//     </tr>
//   ))}
// </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default TaskTemplates;