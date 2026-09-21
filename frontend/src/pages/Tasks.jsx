import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getTasks,
  updateTaskStatus,
} from "../api/taskApi";

const Tasks = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [commentTaskId, setCommentTaskId] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();

      setTasks(data.tasks || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case "MY_TASKS":
        return tasks.filter(
          (task) =>
            task.assignedTo?._id === user?.id ||
            task.assignedTo?._id === user?.userId
        );

      case "IN_PROGRESS":
        return tasks.filter(
          (task) => task.status === "IN_PROGRESS"
        );

      case "REVIEW":
        return tasks.filter(
          (task) => task.status === "READY_FOR_REVIEW"
        );

      case "ALL":
      default:
        return tasks;
    }
  }, [tasks, activeFilter, user]);

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

  const getStatusClass = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return "bg-slate-100 text-slate-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "WAITING_FOR_CLIENT":
        return "bg-yellow-100 text-yellow-700";

      case "READY_FOR_REVIEW":
        return "bg-purple-100 text-purple-700";

      case "CHANGES_REQUESTED":
        return "bg-orange-100 text-orange-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const changeTaskStatus = async (
    taskId,
    status,
    statusComment = ""
  ) => {
    try {
      setUpdatingTaskId(taskId);
      setError("");
      setSuccess("");

      const data = await updateTaskStatus(
        taskId,
        status,
        statusComment
      );

      const updatedTask = data.task;

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                ...updatedTask,
              }
            : task
        )
      );

      setCommentTaskId(null);
      setComment("");

      setSuccess("Task status updated successfully");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update task status"
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleStatusClick = (task, nextStatus) => {
    const needsComment =
      nextStatus === "COMPLETED" ||
      nextStatus === "CHANGES_REQUESTED";

    if (needsComment) {
      setCommentTaskId(task._id);
      setComment("");
      return;
    }

    changeTaskStatus(task._id, nextStatus);
  };

  const renderActionButtons = (task) => {
    const isAssignedUser =
      task.assignedTo?._id === user?.id ||
      task.assignedTo?._id === user?.userId;

    const isManager =
      user?.role === "MANAGER";

    const isAdmin =
      user?.role === "ADMIN";

    const isTeamMember =
      user?.role === "TEAM_MEMBER";

    const isUpdating =
      updatingTaskId === task._id;

    if (task.status === "COMPLETED") {
      return (
        <span className="text-sm text-green-600">
          Completed
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {/* Team member or assigned manager starts work */}
        {task.status === "NOT_STARTED" &&
          isAssignedUser && (
            <button
              onClick={() =>
                handleStatusClick(task, "IN_PROGRESS")
              }
              disabled={isUpdating}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Start
            </button>
          )}

        {/* Move task to waiting for client */}
        {task.status === "IN_PROGRESS" &&
          isAssignedUser && (
            <button
              onClick={() =>
                handleStatusClick(
                  task,
                  "WAITING_FOR_CLIENT"
                )
              }
              disabled={isUpdating}
              className="rounded-lg bg-yellow-500 px-3 py-2 text-xs font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
            >
              Waiting for Client
            </button>
          )}

        {/* Submit task for review */}
        {task.status === "IN_PROGRESS" &&
          isAssignedUser && (
            <button
              onClick={() =>
                handleStatusClick(
                  task,
                  "READY_FOR_REVIEW"
                )
              }
              disabled={isUpdating}
              className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              Submit Review
            </button>
          )}

        {/* Resume task after client response */}
        {task.status === "WAITING_FOR_CLIENT" &&
          isAssignedUser && (
            <button
              onClick={() =>
                handleStatusClick(task, "IN_PROGRESS")
              }
              disabled={isUpdating}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Resume
            </button>
          )}

        {/* Manager/Admin review actions */}
        {task.status === "READY_FOR_REVIEW" &&
          (isManager || isAdmin) &&
          !isAssignedUser && (
            <>
              <button
                onClick={() =>
                  handleStatusClick(task, "COMPLETED")
                }
                disabled={isUpdating}
                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  handleStatusClick(
                    task,
                    "CHANGES_REQUESTED"
                  )
                }
                disabled={isUpdating}
                className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              >
                Request Changes
              </button>
            </>
          )}

        {/* Team member cannot review their own task */}
        {task.status === "READY_FOR_REVIEW" &&
          isAssignedUser &&
          isTeamMember && (
            <span className="text-sm text-purple-600">
              Waiting for manager review
            </span>
          )}

        {/* Changes requested */}
        {task.status === "CHANGES_REQUESTED" &&
          isAssignedUser && (
            <button
              onClick={() =>
                handleStatusClick(task, "IN_PROGRESS")
              }
              disabled={isUpdating}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Work on Changes
            </button>
          )}

        {isUpdating && (
          <span className="self-center text-xs text-slate-500">
            Updating...
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <main className="w-full min-w-0 p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Tasks
            </h1>

            <p className="mt-1 text-slate-500">
              Manage and track assigned tasks.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 w-full rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex w-full max-w-full flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeFilter === "ALL"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              All Tasks
            </button>

            <button
              onClick={() => setActiveFilter("MY_TASKS")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeFilter === "MY_TASKS"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              My Tasks
            </button>

            <button
              onClick={() => setActiveFilter("IN_PROGRESS")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeFilter === "IN_PROGRESS"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              In Progress
            </button>

            <button
              onClick={() => setActiveFilter("REVIEW")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeFilter === "REVIEW"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              Review
            </button>
          </div>

          {/* Task List */}
          <div className="w-full max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Task List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredTasks.length} task(s) found.
              </p>
            </div>

            {loading ? (
              <div className="p-6 text-center text-slate-500">
                Loading tasks...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No tasks found.
              </div>
            ) : (
              <div className="w-full max-w-full overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Task
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Client
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Assigned To
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Due Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {filteredTasks.map((task) => (
                      <tr
                        key={task._id}
                        className="hover:bg-slate-50"
                      >
                        {/* Task */}
                        <td className="max-w-xs px-6 py-4">
                          <p className="font-medium text-slate-800">
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="mt-1 text-sm text-slate-500">
                              {task.description}
                            </p>
                          )}
                        </td>

                        {/* Client */}
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {task.engagement?.client?.name ||
                            "-"}
                        </td>

                        {/* Assigned To */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {task.assignedTo?.name || "-"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {task.assignedTo?.role || ""}
                          </p>
                        </td>

                        {/* Due Date */}
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {formatDate(task.dueDate)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              task.status
                            )}`}
                          >
                            {formatStatus(task.status)}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          {renderActionButtons(task)}

                          {/* Review Comment Form */}
                          {commentTaskId === task._id && (
                            <div className="mt-3 w-64 rounded-lg border border-slate-200 bg-slate-50 p-3">
                              <label className="mb-2 block text-xs font-medium text-slate-700">
                                Review Comment
                              </label>

                              <textarea
                                value={comment}
                                onChange={(e) =>
                                  setComment(e.target.value)
                                }
                                rows={3}
                                placeholder="Enter comment..."
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                              />

                              <div className="mt-2 flex gap-2">
                                <button
                                  onClick={() =>
                                    changeTaskStatus(
                                      task._id,
                                      "COMPLETED",
                                      comment
                                    )
                                  }
                                  className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() =>
                                    changeTaskStatus(
                                      task._id,
                                      "CHANGES_REQUESTED",
                                      comment
                                    )
                                  }
                                  className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
                                >
                                  Request Changes
                                </button>

                                <button
                                  onClick={() => {
                                    setCommentTaskId(null);
                                    setComment("");
                                  }}
                                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;