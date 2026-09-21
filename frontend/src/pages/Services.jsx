
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { createService, getServices } from "../api/serviceApi";

const Services = () => {
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const [services, setServices] = useState([]);

  const [name, setName] = useState("");
  const [engagementType, setEngagementType] =
    useState("RECURRING");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get all services
  const fetchServices = async () => {
    try {
      setFetching(true);
      setError("");

      const data = await getServices();

      setServices(data.services || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load services"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Create service
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Service name is required");
      return;
    }

    try {
      setLoading(true);

      const data = await createService({
        name,
        engagementType,
        frequency:
          engagementType === "RECURRING"
            ? frequency
            : null,
        description,
      });

      setServices((prevServices) => [
        data.service,
        ...prevServices,
      ]);

      setSuccess("Service created successfully");

      setName("");
      setDescription("");
      setEngagementType("RECURRING");
      setFrequency("MONTHLY");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Services Page */}
        <main className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Services
            </h1>

            {/* <p className="text-slate-500 mt-1">
              Create and manage service types.
            </p> */}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-5">
              {success}
            </div>
          )}

          {/* 
            Add New Service
            Only ADMIN can see this section.
          */}
          {user?.role === "ADMIN" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-5">
                Add New Service
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name + Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Service Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Monthly Accounting"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  {/* Engagement Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Engagement Type
                    </label>

                    <select
                      value={engagementType}
                      onChange={(e) =>
                        setEngagementType(e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="RECURRING">
                        Recurring
                      </option>

                      <option value="ONE_TIME">
                        One Time
                      </option>
                    </select>
                  </div>
                </div>

                {/* Frequency */}
                {engagementType === "RECURRING" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Frequency
                    </label>

                    <select
                      value={frequency}
                      onChange={(e) =>
                        setFrequency(e.target.value)
                      }
                      className="w-full md:w-1/2 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="MONTHLY">
                        Monthly
                      </option>

                      <option value="QUARTERLY">
                        Quarterly
                      </option>

                      <option value="YEARLY">
                        Yearly
                      </option>
                    </select>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Describe this service..."
                    rows="4"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  {loading
                    ? "Creating..."
                    : "Create Service"}
                </button>
              </form>
            </div>
          )}

          {/* All Services */}
          <div className="bg-white border border-slate-200 rounded-xl">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                All Services
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {services.length} service
                {services.length !== 1 ? "s" : ""}
              </p>
            </div>

            {fetching ? (
              <div className="p-6 text-slate-500">
                Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No services found.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="p-6 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {service.name}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {service.description ||
                            "No description"}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          service.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {service.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
                        {service.engagementType}
                      </span>

                      {service.frequency && (
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
                          {service.frequency}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Services;







// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import { createService, getServices } from "../api/serviceApi";

// const Services = () => {
//   const [services, setServices] = useState([]);

//   const [name, setName] = useState("");
//   const [engagementType, setEngagementType] = useState("RECURRING");
//   const [frequency, setFrequency] = useState("MONTHLY");
//   const [description, setDescription] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Get all services
//   const fetchServices = async () => {
//     try {
//       setFetching(true);
//       setError("");

//       const data = await getServices();

//       setServices(data.services || []);
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to load services"
//       );
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   // Create service
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!name.trim()) {
//       setError("Service name is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const data = await createService({
//         name,
//         engagementType,
//         frequency:
//           engagementType === "RECURRING"
//             ? frequency
//             : null,
//         description,
//       });

//       setServices((prevServices) => [
//         data.service,
//         ...prevServices,
//       ]);

//       setSuccess("Service created successfully");

//       setName("");
//       setDescription("");
//       setEngagementType("RECURRING");
//       setFrequency("MONTHLY");

//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//           "Failed to create service"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">

//       {/* Sidebar */}
//       <Sidebar />

//       {/* Right Side */}
//       <div className="flex-1">

//         {/* Navbar */}
//         <Navbar />

//         {/* Services Page */}
//         <main className="p-6">

//           {/* Header */}
//           <div className="mb-6">

//             <h1 className="text-2xl font-bold text-slate-800">
//               Services
//             </h1>

//             <p className="text-slate-500 mt-1">
//               Create and manage service types.
//             </p>

//           </div>


//           {/* Error */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5">
//               {error}
//             </div>
//           )}


//           {/* Success */}
//           {success && (
//             <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-5">
//               {success}
//             </div>
//           )}


//           {/* Create Service */}
//           <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">

//             <h2 className="text-lg font-semibold text-slate-800 mb-5">
//               Add New Service
//             </h2>

//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5"
//             >

//               {/* Name + Type */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                 <div>

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Service Name
//                   </label>

//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Monthly Accounting"
//                     className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
//                   />

//                 </div>


//                 <div>

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Engagement Type
//                   </label>

//                   <select
//                     value={engagementType}
//                     onChange={(e) =>
//                       setEngagementType(e.target.value)
//                     }
//                     className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
//                   >

//                     <option value="RECURRING">
//                       Recurring
//                     </option>

//                     <option value="ONE_TIME">
//                       One Time
//                     </option>

//                   </select>

//                 </div>

//               </div>


//               {/* Frequency */}
//               {engagementType === "RECURRING" && (
//                 <div>

//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Frequency
//                   </label>

//                   <select
//                     value={frequency}
//                     onChange={(e) =>
//                       setFrequency(e.target.value)
//                     }
//                     className="w-full md:w-1/2 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
//                   >

//                     <option value="MONTHLY">
//                       Monthly
//                     </option>

//                     <option value="QUARTERLY">
//                       Quarterly
//                     </option>

//                     <option value="YEARLY">
//                       Yearly
//                     </option>

//                   </select>

//                 </div>
//               )}


//               {/* Description */}
//               <div>

//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Description
//                 </label>

//                 <textarea
//                   value={description}
//                   onChange={(e) =>
//                     setDescription(e.target.value)
//                   }
//                   placeholder="Describe this service..."
//                   rows="4"
//                   className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400 resize-none"
//                 />

//               </div>


//               {/* Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
//               >
//                 {loading
//                   ? "Creating..."
//                   : "Create Service"}
//               </button>

//             </form>

//           </div>


//           {/* All Services */}
//           <div className="bg-white border border-slate-200 rounded-xl">

//             <div className="p-6 border-b border-slate-200">

//               <h2 className="text-lg font-semibold text-slate-800">
//                 All Services
//               </h2>

//               <p className="text-sm text-slate-500 mt-1">
//                 {services.length} service
//                 {services.length !== 1 ? "s" : ""}
//               </p>

//             </div>


//             {fetching ? (

//               <div className="p-6 text-slate-500">
//                 Loading services...
//               </div>

//             ) : services.length === 0 ? (

//               <div className="p-10 text-center text-slate-500">
//                 No services found.
//               </div>

//             ) : (

//               <div className="divide-y divide-slate-200">

//                 {services.map((service) => (

//                   <div
//                     key={service._id}
//                     className="p-6 hover:bg-slate-50"
//                   >

//                     <div className="flex items-center justify-between">

//                       <div>

//                         <h3 className="font-semibold text-slate-800">
//                           {service.name}
//                         </h3>

//                         <p className="text-sm text-slate-500 mt-1">
//                           {service.description ||
//                             "No description"}
//                         </p>

//                       </div>


//                       <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
//                         {service.isActive
//                           ? "ACTIVE"
//                           : "INACTIVE"}
//                       </span>

//                     </div>


//                     <div className="flex gap-2 mt-4">

//                       <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
//                         {service.engagementType}
//                       </span>

//                       {service.frequency && (
//                         <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
//                           {service.frequency}
//                         </span>
//                       )}

//                     </div>

//                   </div>

//                 ))}

//               </div>

//             )}

//           </div>

//         </main>

//       </div>

//     </div>
//   );
// };

// export default Services;