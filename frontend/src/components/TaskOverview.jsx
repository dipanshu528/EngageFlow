const TaskOverview = ({
  notStarted = 0,
  inProgress = 0,
  waitingForClient = 0,
  waitingForReview = 0,
  changesRequested = 0,
  loading = false,
}) => {
  const totalTasks =
    notStarted +
    inProgress +
    waitingForClient +
    waitingForReview +
    changesRequested;

  const getWidth = (count) => {
    if (totalTasks === 0) {
      return "0%";
    }

    return `${(count / totalTasks) * 100}%`;
  };

  const tasks = [
    {
      name: "Not Started",
      count: notStarted,
      width: getWidth(notStarted),
    },
    {
      name: "In Progress",
      count: inProgress,
      width: getWidth(inProgress),
    },
    {
      name: "Waiting for Client",
      count: waitingForClient,
      width: getWidth(waitingForClient),
    },
    {
      name: "Ready for Review",
      count: waitingForReview,
      width: getWidth(waitingForReview),
    },
    {
      name: "Changes Requested",
      count: changesRequested,
      width: getWidth(changesRequested),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-slate-800">
        Task Overview
      </h2>

      {loading ? (
        <div className="py-6 text-center text-sm text-slate-500">
          Loading task overview...
        </div>
      ) : (
        <div className="space-y-5">
          {tasks.map((task) => (
            <div key={task.name}>
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-slate-600">
                  {task.name}
                </span>

                <span className="text-sm font-medium">
                  {task.count}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-800 transition-all duration-500"
                  style={{
                    width: task.width,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskOverview;


// const TaskOverview = ({
//   notStarted = 0,
//   inProgress = 0,
//   waitingForClient = 0,
//   waitingForReview = 0,
//   loading = false,
// }) => {

//   const totalTasks =
//     notStarted +
//     inProgress +
//     waitingForClient +
//     waitingForReview;

//   const getWidth = (count) => {
//     if (totalTasks === 0) {
//       return "0%";
//     }

//     return `${(count / totalTasks) * 100}%`;
//   };

//   const tasks = [
//     {
//       name: "Not Started",
//       count: notStarted,
//       width: getWidth(notStarted),
//     },
//     {
//       name: "In Progress",
//       count: inProgress,
//       width: getWidth(inProgress),
//     },
//     {
//       name: "Waiting for Client",
//       count: waitingForClient,
//       width: getWidth(waitingForClient),
//     },
//     {
//       name: "Ready for Review",
//       count: waitingForReview,
//       width: getWidth(waitingForReview),
//     },
//   ];

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-6">

//       <h2 className="mb-6 text-lg font-semibold text-slate-800">
//         Task Overview
//       </h2>

//       {loading ? (
//         <div className="py-6 text-center text-sm text-slate-500">
//           Loading task overview...
//         </div>
//       ) : (
//         <div className="space-y-5">

//           {tasks.map((task) => (
//             <div key={task.name}>

//               <div className="mb-2 flex justify-between">

//                 <span className="text-sm text-slate-600">
//                   {task.name}
//                 </span>

//                 <span className="text-sm font-medium">
//                   {task.count}
//                 </span>

//               </div>

//               <div className="h-2 rounded-full bg-slate-100">

//                 <div
//                   className="h-2 rounded-full bg-slate-800 transition-all duration-500"
//                   style={{
//                     width: task.width,
//                   }}
//                 />

//               </div>

//             </div>
//           ))}

//         </div>
//       )}

//     </div>
//   );
// };

// export default TaskOverview;



// const TaskOverview = () => {

//   const tasks = [
//     {
//       name: "Not Started",
//       count: 8,
//       width: "40%"
//     },
//     {
//       name: "In Progress",
//       count: 10,
//       width: "60%"
//     },
//     {
//       name: "Waiting for Client",
//       count: 3,
//       width: "20%"
//     },
//     {
//       name: "Ready for Review",
//       count: 5,
//       width: "35%"
//     }
//   ];

//   return (
//     <div className="bg-white border border-slate-200 rounded-xl p-6">

//       <h2 className="text-lg font-semibold text-slate-800 mb-6">
//         Task Overview
//       </h2>

//       <div className="space-y-5">

//         {tasks.map((task) => (

//           <div key={task.name}>

//             <div className="flex justify-between mb-2">

//               <span className="text-sm text-slate-600">
//                 {task.name}
//               </span>

//               <span className="text-sm font-medium">
//                 {task.count}
//               </span>

//             </div>

//             <div className="h-2 bg-slate-100 rounded-full">

//               <div
//                 className="h-2 bg-slate-800 rounded-full"
//                 style={{ width: task.width }}
//               />

//             </div>

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// };

// export default TaskOverview;