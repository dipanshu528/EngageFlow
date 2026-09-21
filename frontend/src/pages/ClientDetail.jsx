import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClientById } from "../api/clientApi";

// --- Helper: sanitize phone into wa.me-compatible international format
function toWhatsappNumber(rawPhone) {
  if (!rawPhone) return null;

  const digitsOnly = rawPhone.replace(/[^\d]/g, "");

  if (!digitsOnly) return null;

  if (digitsOnly.length === 10) {
    return "91" + digitsOnly;
  }

  return digitsOnly;
}

// --- Sub-component: WhatsApp icon (SVG)
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.478 2 12.001c0 1.905.518 3.744 1.499 5.363L2 22l4.735-1.475A9.943 9.943 0 0012.001 22C17.523 22 22 17.523 22 12.001 22 6.478 17.523 2 12.001 2zm0 18.146a8.11 8.11 0 01-4.13-1.129l-.296-.176-2.812.877.887-2.751-.192-.291a8.12 8.12 0 01-1.259-4.375c0-4.484 3.649-8.132 8.132-8.132 4.483 0 8.131 3.649 8.131 8.132 0 4.483-3.648 8.132-8.131 8.132z" />
    </svg>
  );
}

// --- Sub-component: WhatsApp button, renders nothing if no valid number
function WhatsAppButton({ phone, label }) {
  const waNumber = toWhatsappNumber(phone);

  if (!waNumber) {
    return null;
  }

  const waLink = "https://wa.me/" + waNumber;
  const waTitle = "Chat with " + label + " on WhatsApp";

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      title={waTitle}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors ml-2"
    >
      <WhatsAppIcon />
    </a>
  );
}

// --- Sub-component: labeled field, optionally with an action button
function Field({ label, value, action }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-center mt-1">
        <p className="text-slate-900">{value || "—"}</p>
        {action}
      </div>
    </div>
  );
}

// --- Sub-component: status badge
function StatusBadge({ status }) {
  const isActive = status === "ACTIVE";

  const badgeClass = isActive
    ? "bg-green-100 text-green-700"
    : "bg-slate-100 text-slate-600";

  return (
    <span className={"px-3 py-1 rounded-full text-xs font-medium " + badgeClass}>
      {status}
    </span>
  );
}

// --- Main page component
function ClientDetail() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchClient() {
      try {
        setLoading(true);
        const data = await getClientById(id);

        if (isMounted) {
          setClient(data.client);
        }
      } catch (err) {
        console.error(err);

        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load client"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchClient();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading client...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!client) {
    return <div className="p-6 text-slate-500">Client not found.</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <Link
        to="/clients"
        className="text-sm text-slate-500 hover:text-slate-900 mb-4 inline-block"
      >
        ← Back to Clients
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {client.name}
            </h1>
            {client.tradeName && (
              <p className="text-slate-500">{client.tradeName}</p>
            )}
          </div>

          <StatusBadge status={client.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Field label="Email" value={client.email} />

          <Field
            label="Phone"
            value={client.phone}
            action={<WhatsAppButton phone={client.phone} label={client.name} />}
          />

          <Field label="GSTIN" value={client.gstin} />
          <Field label="PAN" value={client.pan} />
          <Field label="State" value={client.state} />
          <Field label="Registration Type" value={client.registrationType} />
          <Field label="Filing Frequency" value={client.filingFrequency} />
          <Field label="GST Status" value={client.gstStatus} />
        </div>

        {client.address && (
          <div className="mb-8">
            <Field label="Address" value={client.address} />
          </div>
        )}

        {client.authorizedSignatory && (
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Authorized Signatory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Name" value={client.authorizedSignatory.name} />
              <Field label="Email" value={client.authorizedSignatory.email} />

              <Field
                label="Phone"
                value={client.authorizedSignatory.phone}
              />
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-6 mt-6 text-xs text-slate-400">
          Created: {new Date(client.createdAt).toLocaleString()} · Last
          updated: {new Date(client.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default ClientDetail;




// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { getClientById } from "../api/clientApi";

// const ClientDetail = () => {
//   const { id } = useParams();

//   const [client, setClient] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchClient = async () => {
//       try {
//         setLoading(true);
//         const data = await getClientById(id);
//         setClient(data.client);
//       } catch (err) {
//         console.error(err);
//         setError(
//           err.response?.data?.message || "Failed to load client"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClient();
//   }, [id]);

//   if (loading) {
//     return <div className="p-6 text-slate-500">Loading client...</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (!client) {
//     return <div className="p-6 text-slate-500">Client not found.</div>;
//   }

//   const Field = ({ label, value }) => (
//     <div>
//       <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//         {label}
//       </p>
//       <p className="text-slate-900 mt-1">{value || "—"}</p>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-3xl">
//       <Link
//         to="/clients"
//         className="text-sm text-slate-500 hover:text-slate-900 mb-4 inline-block"
//       >
//         ← Back to Clients
//       </Link>

//       <div className="bg-white border border-slate-200 rounded-xl p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               {client.name}
//             </h1>
//             {client.tradeName && (
//               <p className="text-slate-500">{client.tradeName}</p>
//             )}
//           </div>

//           <span
//             className={`px-3 py-1 rounded-full text-xs font-medium ${
//               client.status === "ACTIVE"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-slate-100 text-slate-600"
//             }`}
//           >
//             {client.status}
//           </span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <Field label="Email" value={client.email} />
//           <Field label="Phone" value={client.phone} />
//           <Field label="GSTIN" value={client.gstin} />
//           <Field label="PAN" value={client.pan} />
//           <Field label="State" value={client.state} />
//           <Field label="Registration Type" value={client.registrationType} />
//           <Field label="Filing Frequency" value={client.filingFrequency} />
//           <Field label="GST Status" value={client.gstStatus} />
//         </div>

//         {client.address && (
//           <div className="mb-8">
//             <Field label="Address" value={client.address} />
//           </div>
//         )}

//         {client.authorizedSignatory && (
//           <div className="border-t border-slate-100 pt-6">
//             <h2 className="text-sm font-semibold text-slate-900 mb-4">
//               Authorized Signatory
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <Field label="Name" value={client.authorizedSignatory.name} />
//               <Field label="Email" value={client.authorizedSignatory.email} />
//               <Field label="Phone" value={client.authorizedSignatory.phone} />
//             </div>
//           </div>
//         )}

//         <div className="border-t border-slate-100 pt-6 mt-6 text-xs text-slate-400">
//           Created: {new Date(client.createdAt).toLocaleString()} · Last updated:{" "}
//           {new Date(client.updatedAt).toLocaleString()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientDetail;