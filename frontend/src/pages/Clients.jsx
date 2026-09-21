import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createClient, getClients } from "../api/clientApi";

const initialFormState = {
  name: "",
  email: "",
  gstin: "",
  state: "",
  tradeName: "",
  phone: "",
  pan: "",
  registrationType: "REGULAR",
  filingFrequency: "MONTHLY",
  address: "",
  signatoryName: "",
  signatoryEmail: "",
  signatoryPhone: "",
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchGstin, setSearchGstin] = useState("");

  const [form, setForm] = useState(initialFormState);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchClients = async () => {
    try {
      setFetching(true);
      const data = await getClients();
      setClients(data.clients || []);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to load clients"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.gstin || !form.state) {
      setError("Name, email, GSTIN and state are required");
      return;
    }

    const hasSignatory =
      form.signatoryName || form.signatoryEmail || form.signatoryPhone;

    try {
      setLoading(true);

      const data = await createClient({
        name: form.name,
        email: form.email,
        gstin: form.gstin,
        state: form.state,
        tradeName: form.tradeName || undefined,
        phone: form.phone || undefined,
        pan: form.pan || undefined,
        registrationType: form.registrationType,
        filingFrequency: form.filingFrequency,
        address: form.address || undefined,
        authorizedSignatory: hasSignatory
          ? {
              name: form.signatoryName || undefined,
              email: form.signatoryEmail || undefined,
              phone: form.signatoryPhone || undefined,
            }
          : undefined,
      });

      setSuccess("Client created successfully");

      setClients((prevClients) => [data.client, ...prevClients]);

      setForm(initialFormState);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to create client"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter clients by GSTIN (case-insensitive, partial match)
  const filteredClients = clients.filter((client) => {
    if (!searchGstin.trim()) return true;

    const gstin = client.gstin || "";
    return gstin.toLowerCase().includes(searchGstin.trim().toLowerCase());
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="text-slate-500 mt-1">Create and manage your clients</p>
      </div>

      {/* Create Client - ADMIN ONLY */}
      {user?.role === "ADMIN" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">
            Add New Client
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter client name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trade Name
              </label>
              <input
                type="text"
                name="tradeName"
                value={form.tradeName}
                onChange={handleChange}
                placeholder="If different from legal name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter client email"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GSTIN *
              </label>
              <input
                type="text"
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                placeholder="e.g. 22AAAAA0000A1Z5"
                maxLength={15}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PAN
              </label>
              <input
                type="text"
                name="pan"
                value={form.pan}
                onChange={handleChange}
                placeholder="e.g. AAAAA0000A"
                maxLength={10}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Registration Type
              </label>
              <select
                name="registrationType"
                value={form.registrationType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 bg-white"
              >
                <option value="REGULAR">Regular</option>
                <option value="COMPOSITION">Composition</option>
                <option value="CASUAL_TAXABLE">Casual Taxable</option>
                <option value="INPUT_SERVICE_DISTRIBUTOR">
                  Input Service Distributor
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filing Frequency
              </label>
              <select
                name="filingFrequency"
                value={form.filingFrequency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 bg-white"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Registered address"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div className="md:col-span-3 pt-2 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3 mt-2">
                Authorized Signatory (optional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Signatory Name
              </label>
              <input
                type="text"
                name="signatoryName"
                value={form.signatoryName}
                onChange={handleChange}
                placeholder="Enter signatory name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Signatory Email
              </label>
              <input
                type="email"
                name="signatoryEmail"
                value={form.signatoryEmail}
                onChange={handleChange}
                placeholder="Enter signatory email"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Signatory Phone
              </label>
              <input
                type="text"
                name="signatoryPhone"
                value={form.signatoryPhone}
                onChange={handleChange}
                placeholder="Enter signatory phone"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Client"}
              </button>
            </div>
          </form>
        </div>
      )}

      {user?.role !== "ADMIN" && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Search by GSTIN */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search by GSTIN
        </label>
        <input
          type="text"
          value={searchGstin}
          onChange={(e) => setSearchGstin(e.target.value)}
          placeholder="Enter GSTIN to search"
          className="w-full md:w-96 px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 uppercase"
        />
      </div>

      {/* All Clients */}
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            All Clients
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {filteredClients.length} client
            {filteredClients.length !== 1 ? "s" : ""}
            {searchGstin.trim() ? " (filtered)" : ""}
          </p>
        </div>

        {fetching ? (
          <div className="p-6 text-slate-500">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            {searchGstin.trim()
              ? "No clients match that GSTIN."
              : "No clients found."}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredClients.map((client) => (
              <Link
                to={`/clients/${client._id}`}
                key={client._id}
                className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <h3 className="font-medium text-slate-900">
                    {client.name}
                    {client.tradeName ? ` (${client.tradeName})` : ""}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {client.email} · {client.gstin} · {client.state}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    client.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {client.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;










// import { useEffect, useState } from "react";
// import { createClient, getClients } from "../api/clientApi";
// import { Link } from "react-router-dom";

// const initialFormState = {
//   name: "",
//   email: "",
//   gstin: "",
//   state: "",
//   tradeName: "",
//   phone: "",
//   pan: "",
//   registrationType: "REGULAR",
//   filingFrequency: "MONTHLY",
//   address: "",
//   signatoryName: "",
//   signatoryEmail: "",
//   signatoryPhone: "",
// };

// const Clients = () => {
//   const [clients, setClients] = useState([]);

//   const [form, setForm] = useState(initialFormState);

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Get logged-in user
//   const user = JSON.parse(localStorage.getItem("user"));

//   // Get all clients
//   const fetchClients = async () => {
//     try {
//       setFetching(true);

//       const data = await getClients();

//       setClients(data.clients || []);
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to load clients"
//       );
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Create client
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!form.name || !form.email || !form.gstin || !form.state) {
//       setError("Name, email, GSTIN and state are required");
//       return;
//     }

//     const hasSignatory =
//       form.signatoryName || form.signatoryEmail || form.signatoryPhone;

//     try {
//       setLoading(true);

//       const data = await createClient({
//         name: form.name,
//         email: form.email,
//         gstin: form.gstin,
//         state: form.state,
//         tradeName: form.tradeName || undefined,
//         phone: form.phone || undefined,
//         pan: form.pan || undefined,
//         registrationType: form.registrationType,
//         filingFrequency: form.filingFrequency,
//         address: form.address || undefined,
//         authorizedSignatory: hasSignatory
//           ? {
//               name: form.signatoryName || undefined,
//               email: form.signatoryEmail || undefined,
//               phone: form.signatoryPhone || undefined,
//             }
//           : undefined,
//       });

//       setSuccess("Client created successfully");

//       // Add new client to the list immediately
//       setClients((prevClients) => [
//         data.client,
//         ...prevClients,
//       ]);

//       // Clear form
//       setForm(initialFormState);
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to create client"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">

//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-900">
//           Clients
//         </h1>

//         <p className="text-slate-500 mt-1">
//           Create and manage your clients
//         </p>
//       </div>

//       {/* Create Client - ADMIN ONLY */}
//       {user?.role === "ADMIN" && (
//         <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">

//           <h2 className="text-lg font-semibold text-slate-900 mb-5">
//             Add New Client
//           </h2>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
//               {success}
//             </div>
//           )}

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-3 gap-4"
//           >

//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Client Name *
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Enter client name"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             {/* Trade Name */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Trade Name
//               </label>

//               <input
//                 type="text"
//                 name="tradeName"
//                 value={form.tradeName}
//                 onChange={handleChange}
//                 placeholder="If different from legal name"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Email *
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Enter client email"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Phone
//               </label>

//               <input
//                 type="text"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="Enter phone number"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             {/* GSTIN */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 GSTIN *
//               </label>

//               <input
//                 type="text"
//                 name="gstin"
//                 value={form.gstin}
//                 onChange={handleChange}
//                 placeholder="e.g. 22AAAAA0000A1Z5"
//                 maxLength={15}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 uppercase"
//               />
//             </div>

//             {/* PAN */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 PAN
//               </label>

//               <input
//                 type="text"
//                 name="pan"
//                 value={form.pan}
//                 onChange={handleChange}
//                 placeholder="e.g. AAAAA0000A"
//                 maxLength={10}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 uppercase"
//               />
//             </div>

//             {/* State */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 State *
//               </label>

//               <input
//                 type="text"
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//                 placeholder="Enter state"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             {/* Registration Type */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Registration Type
//               </label>

//               <select
//                 name="registrationType"
//                 value={form.registrationType}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 bg-white"
//               >
//                 <option value="REGULAR">Regular</option>
//                 <option value="COMPOSITION">Composition</option>
//                 <option value="CASUAL_TAXABLE">Casual Taxable</option>
//                 <option value="INPUT_SERVICE_DISTRIBUTOR">Input Service Distributor</option>
//               </select>
//             </div>

//             {/* Filing Frequency */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Filing Frequency
//               </label>

//               <select
//                 name="filingFrequency"
//                 value={form.filingFrequency}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 bg-white"
//               >
//                 <option value="MONTHLY">Monthly</option>
//                 <option value="QUARTERLY">Quarterly</option>
//               </select>
//             </div>

//             {/* Address */}
//             <div className="md:col-span-3">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Address
//               </label>

//               <input
//                 type="text"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 placeholder="Registered address"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             {/* Authorized Signatory */}
//             <div className="md:col-span-3 pt-2 border-t border-slate-100">
//               <p className="text-sm font-medium text-slate-700 mb-3 mt-2">
//                 Authorized Signatory (optional)
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Signatory Name
//               </label>

//               <input
//                 type="text"
//                 name="signatoryName"
//                 value={form.signatoryName}
//                 onChange={handleChange}
//                 placeholder="Enter signatory name"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Signatory Email
//               </label>

//               <input
//                 type="email"
//                 name="signatoryEmail"
//                 value={form.signatoryEmail}
//                 onChange={handleChange}
//                 placeholder="Enter signatory email"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Signatory Phone
//               </label>

//               <input
//                 type="text"
//                 name="signatoryPhone"
//                 value={form.signatoryPhone}
//                 onChange={handleChange}
//                 placeholder="Enter signatory phone"
//                 className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//               />
//             </div>

//             {/* Button */}
//             <div className="md:col-span-3">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-slate-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
//               >
//                 {loading ? "Creating..." : "Create Client"}
//               </button>
//             </div>

//           </form>
//         </div>
//       )}

//       {/* Error / Success for non-admin list fetching */}
//       {user?.role !== "ADMIN" && error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
//           {error}
//         </div>
//       )}

//       {/* All Clients */}
//       <div className="bg-white border border-slate-200 rounded-xl">

//         <div className="p-6 border-b border-slate-200">
//           <h2 className="text-lg font-semibold text-slate-900">
//             All Clients
//           </h2>

//           <p className="text-sm text-slate-500 mt-1">
//             {clients.length} client{clients.length !== 1 ? "s" : ""}
//           </p>
//         </div>

//         {fetching ? (
//           <div className="p-6 text-slate-500">
//             Loading clients...
//           </div>
//         ) : clients.length === 0 ? (
//           <div className="p-10 text-center text-slate-500">
//             No clients found.
//           </div>
//         ) : (
//           <div className="divide-y divide-slate-200">

//           {clients.map((client) => (
//   <Link
//     to={`/clients/${client._id}`}
//     key={client._id}
//     className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
//   >
//     <div>
//       <h3 className="font-medium text-slate-900">
//         {client.name}
//         {client.tradeName ? ` (${client.tradeName})` : ""}
//       </h3>

//       <p className="text-sm text-slate-500 mt-1">
//         {client.email} · {client.gstin} · {client.state}
//       </p>
//     </div>

//     <span
//       className={`px-3 py-1 rounded-full text-xs font-medium ${
//         client.status === "ACTIVE"
//           ? "bg-green-100 text-green-700"
//           : "bg-slate-100 text-slate-600"
//       }`}
//     >
//       {client.status}
//     </span>
//   </Link>
// ))}

//           </div>
//         )}

//       </div>

//     </div>
//   );
// };

// export default Clients;









// import { useEffect, useState } from "react";
// import { createClient, getClients } from "../api/clientApi";

// const Clients = () => {
//   const [clients, setClients] = useState([]);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Get all clients
//   const fetchClients = async () => {
//     try {
//       setFetching(true);

//       const data = await getClients();

//       setClients(data.clients || []);
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to load clients"
//       );
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     fetchClients();
//   }, []);

//   // Create client
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!name || !email) {
//       setError("Name and email are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const data = await createClient({
//         name,
//         email,
//       });

//       setSuccess("Client created successfully");

//       // Add new client to the list immediately
//       setClients((prevClients) => [
//         data.client,
//         ...prevClients,
//       ]);

//       // Clear form
//       setName("");
//       setEmail("");
//     } catch (error) {
//       console.error(error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to create client"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">

//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-900">
//           Clients
//         </h1>

//         <p className="text-slate-500 mt-1">
//           Create and manage your clients
//         </p>
//       </div>

//       {/* Create Client */}
//       <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">

//         <h2 className="text-lg font-semibold text-slate-900 mb-5">
//           Add New Client
//         </h2>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
//             {success}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
//         >

//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Client Name
//             </label>

//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter client name"
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Email
//             </label>

//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter client email"
//               className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-slate-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
//           >
//             {loading ? "Creating..." : "Create Client"}
//           </button>

//         </form>
//       </div>

//       {/* All Clients */}
//       <div className="bg-white border border-slate-200 rounded-xl">

//         <div className="p-6 border-b border-slate-200">
//           <h2 className="text-lg font-semibold text-slate-900">
//             All Clients
//           </h2>

//           <p className="text-sm text-slate-500 mt-1">
//             {clients.length} client{clients.length !== 1 ? "s" : ""}
//           </p>
//         </div>

//         {fetching ? (
//           <div className="p-6 text-slate-500">
//             Loading clients...
//           </div>
//         ) : clients.length === 0 ? (
//           <div className="p-10 text-center text-slate-500">
//             No clients found.
//           </div>
//         ) : (
//           <div className="divide-y divide-slate-200">

//             {clients.map((client) => (
//               <div
//                 key={client._id}
//                 className="p-5 flex items-center justify-between hover:bg-slate-50"
//               >

//                 <div>
//                   <h3 className="font-medium text-slate-900">
//                     {client.name}
//                   </h3>

//                   <p className="text-sm text-slate-500 mt-1">
//                     {client.email}
//                   </p>
//                 </div>

//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     client.status === "ACTIVE"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-slate-100 text-slate-600"
//                   }`}
//                 >
//                   {client.status}
//                 </span>

//               </div>
//             ))}

//           </div>
//         )}

//       </div>

//     </div>
//   );


//  };

// export default Clients;