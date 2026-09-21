import mongoose from "mongoose";

import Engagement from "../models/engagement.model.js";
import Client from "../models/client.model.js";
import ServiceType from "../models/serviceType.model.js";
import TaskTemplate from "../models/taskTemplate.model.js";
import Task from "../models/task.model.js";
import Notification from "../models/notification.model.js";


// CREATE ENGAGEMENT
export const createEngagement = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      client,
      serviceType,
      period,
      startDate,
      dueDate,
    } = req.body;


    // --------------------------------
    // VALIDATION
    // --------------------------------

    if (
      !client ||
      !serviceType ||
      !period ||
      !startDate ||
      !dueDate
    ) {
      return res.status(400).json({
        message:
          "Client, service type, period, start date and due date are required",
      });
    }


    session.startTransaction();


    // --------------------------------
    // CHECK CLIENT
    // --------------------------------

    const existingClient = await Client.findById(
      client
    ).session(session);

    if (!existingClient) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Client not found",
      });
    }


    // --------------------------------
    // CHECK SERVICE
    // --------------------------------

    const existingService = await ServiceType.findById(
      serviceType
    ).session(session);

    if (!existingService) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Service type not found",
      });
    }


    // --------------------------------
    // CHECK DUPLICATE ENGAGEMENT
    // --------------------------------

    const existingEngagement =
      await Engagement.findOne({
        client,
        serviceType,
        period,
      }).session(session);

    if (existingEngagement) {
      await session.abortTransaction();

      return res.status(409).json({
        message:
          "Engagement already exists for this client, service and period",
      });
    }


    // --------------------------------
    // GET TASK TEMPLATES
    // --------------------------------

    const templates = await TaskTemplate.find({
      serviceType,
      isActive: true,
    })
      .sort({
        order: 1,
      })
      .session(session);


    if (templates.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        message:
          "No active task templates found for this service",
      });
    }


    // --------------------------------
    // CHECK TEMPLATE ASSIGNMENT
    // --------------------------------

    for (const template of templates) {

      if (!template.assignedTo) {

        await session.abortTransaction();

        return res.status(400).json({
          message:
            `Task template "${template.title}" does not have an assigned user`,
        });
      }
    }


    // --------------------------------
    // CREATE ENGAGEMENT
    // --------------------------------

    const engagement = new Engagement({
      client,
      serviceType,
      period,
      startDate,
      dueDate,
      createdBy: req.user.userId,
    });


    await engagement.save({
      session,
    });


    // --------------------------------
    // CREATE TASKS + NOTIFICATIONS
    // --------------------------------

    const tasks = [];

    for (const template of templates) {

      // Create task
      const task = new Task({

        engagement: engagement._id,

        template: template._id,

        // Assignment comes from TaskTemplate
        assignedTo: template.assignedTo,

        title: template.title,

        description: template.description,

        status: "NOT_STARTED",

        dueDate,
      });


      await task.save({
        session,
      });


      // --------------------------------
      // CREATE NOTIFICATION
      // --------------------------------

      const notification =
        new Notification({

          // The user who receives notification
          recipient:
            template.assignedTo,

          // Related task
          task: task._id,

          // Notification title
          title: "New Task Assigned",

          // Notification message
          message:
            `"${task.title}" has been assigned to you.`,

          // Notification type
          type: "TASK_ASSIGNED",
        });


      await notification.save({
        session,
      });


      tasks.push(task);
    }


    // --------------------------------
    // COMMIT TRANSACTION
    // --------------------------------

    await session.commitTransaction();


    // --------------------------------
    // RESPONSE
    // --------------------------------

    res.status(201).json({
      message:
        "Engagement created successfully",

      engagement,

      tasks,
    });


  } catch (error) {

    await session.abortTransaction();


    // Duplicate engagement
    if (error.code === 11000) {

      return res.status(409).json({
        message:
          "Engagement already exists for this client, service and period",
      });
    }


    console.error(error);


    res.status(500).json({
      message: "Server error",
      error: error.message,
    });


  } finally {

    await session.endSession();

  }
};


// GET ALL ENGAGEMENTS
export const getEngagements = async (req, res) => {
  try {

    const engagements = await Engagement.find()

      .populate(
        "client",
        "name email"
      )

      .populate(
        "serviceType",
        "name engagementType frequency"
      )

      .populate(
        "createdBy",
        "name email role"
      )

      .sort({
        createdAt: -1,
      });


    res.status(200).json({
      engagements,
    });


  } catch (error) {

    console.error(error);


    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};








// import mongoose from "mongoose";

// import Engagement from "../models/engagement.model.js";
// import Client from "../models/client.model.js";
// import ServiceType from "../models/serviceType.model.js";
// import TaskTemplate from "../models/taskTemplate.model.js";
// import Task from "../models/task.model.js";


// // CREATE ENGAGEMENT
// export const createEngagement = async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     const {
//       client,
//       serviceType,
//       period,
//       startDate,
//       dueDate,
//     } = req.body;


//     // --------------------------------
//     // VALIDATION
//     // --------------------------------

//     if (
//       !client ||
//       !serviceType ||
//       !period ||
//       !startDate ||
//       !dueDate
//     ) {
//       return res.status(400).json({
//         message:
//           "Client, service type, period, start date and due date are required",
//       });
//     }


//     session.startTransaction();


//     // --------------------------------
//     // CHECK CLIENT
//     // --------------------------------

//     const existingClient = await Client.findById(
//       client
//     ).session(session);

//     if (!existingClient) {
//       await session.abortTransaction();

//       return res.status(404).json({
//         message: "Client not found",
//       });
//     }


//     // --------------------------------
//     // CHECK SERVICE
//     // --------------------------------

//     const existingService = await ServiceType.findById(
//       serviceType
//     ).session(session);

//     if (!existingService) {
//       await session.abortTransaction();

//       return res.status(404).json({
//         message: "Service type not found",
//       });
//     }


//     // --------------------------------
//     // CHECK DUPLICATE ENGAGEMENT
//     // --------------------------------

//     const existingEngagement = await Engagement.findOne({
//       client,
//       serviceType,
//       period,
//     }).session(session);

//     if (existingEngagement) {
//       await session.abortTransaction();

//       return res.status(409).json({
//         message:
//           "Engagement already exists for this client, service and period",
//       });
//     }


//     // --------------------------------
//     // GET TASK TEMPLATES
//     // --------------------------------

//     const templates = await TaskTemplate.find({
//       serviceType,
//       isActive: true,
//     })
//       .sort({
//         order: 1,
//       })
//       .session(session);


//     if (templates.length === 0) {
//       await session.abortTransaction();

//       return res.status(400).json({
//         message:
//           "No active task templates found for this service",
//       });
//     }


//     // --------------------------------
//     // CHECK TEMPLATE ASSIGNMENT
//     // --------------------------------

//     for (const template of templates) {

//       if (!template.assignedTo) {

//         await session.abortTransaction();

//         return res.status(400).json({
//           message:
//             `Task template "${template.title}" does not have an assigned user`,
//         });
//       }
//     }


//     // --------------------------------
//     // CREATE ENGAGEMENT
//     // --------------------------------

//     const engagement = new Engagement({
//       client,
//       serviceType,
//       period,
//       startDate,
//       dueDate,
//       createdBy: req.user.userId,
//     });


//     await engagement.save({
//       session,
//     });


//     // --------------------------------
//     // CREATE TASKS
//     // --------------------------------

//     const tasks = [];

//     for (const template of templates) {

//       const task = new Task({

//         engagement: engagement._id,

//         template: template._id,

//         // Assignment comes from TaskTemplate
//         assignedTo: template.assignedTo,

//         title: template.title,

//         description: template.description,

//         status: "NOT_STARTED",

//         dueDate,
//       });


//       await task.save({
//         session,
//       });


//       tasks.push(task);
//     }


//     // --------------------------------
//     // COMMIT TRANSACTION
//     // --------------------------------

//     await session.commitTransaction();


//     // --------------------------------
//     // RESPONSE
//     // --------------------------------

//     res.status(201).json({
//       message:
//         "Engagement created successfully",

//       engagement,

//       tasks,
//     });


//   } catch (error) {

//     await session.abortTransaction();


//     // Duplicate engagement
//     if (error.code === 11000) {

//       return res.status(409).json({
//         message:
//           "Engagement already exists for this client, service and period",
//       });
//     }


//     console.error(error);


//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });


//   } finally {

//     await session.endSession();

//   }
// };


// // GET ALL ENGAGEMENTS
// export const getEngagements = async (req, res) => {
//   try {

//     const engagements = await Engagement.find()

//       .populate(
//         "client",
//         "name email"
//       )

//       .populate(
//         "serviceType",
//         "name engagementType frequency"
//       )

//       .populate(
//         "createdBy",
//         "name email role"
//       )

//       .sort({
//         createdAt: -1,
//       });


//     res.status(200).json({
//       engagements,
//     });


//   } catch (error) {

//     console.error(error);


//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });

//   }
// };



// import mongoose from "mongoose";

// import Engagement from "../models/engagement.model.js";
// import Client from "../models/client.model.js";
// import ServiceType from "../models/serviceType.model.js";
// import TaskTemplate from "../models/taskTemplate.model.js";
// import Task from "../models/task.model.js";
// import User from "../models/user.model.js";

// export const createEngagement = async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     const {
//       client,
//       serviceType,
//       period,
//       startDate,
//       dueDate
//     } = req.body;

//     // -----------------------------
//     // 1. Validate required fields
//     // -----------------------------

//     if (
//       !client ||
//       !serviceType ||
//       !period ||
//       !startDate ||
//       !dueDate
//     ) {
//       return res.status(400).json({
//         message:
//           "Client, service type, period, start date and due date are required"
//       });
//     }

//     // -----------------------------
//     // 2. Start transaction
//     // -----------------------------

//     session.startTransaction();

//     // -----------------------------
//     // 3. Check client
//     // -----------------------------

//     const existingClient = await Client.findById(client).session(session);

//     if (!existingClient) {
//       await session.abortTransaction();

//       return res.status(404).json({
//         message: "Client not found"
//       });
//     }

//     // -----------------------------
//     // 4. Check service type
//     // -----------------------------

//     const existingService = await ServiceType.findById(
//       serviceType
//     ).session(session);

//     if (!existingService) {
//       await session.abortTransaction();

//       return res.status(404).json({
//         message: "Service type not found"
//       });
//     }

//     // -----------------------------
//     // 5. Check duplicate engagement
//     // -----------------------------

//     const existingEngagement = await Engagement.findOne({
//       client,
//       serviceType,
//       period
//     }).session(session);

//     if (existingEngagement) {
//       await session.abortTransaction();

//       return res.status(409).json({
//         message:
//           "Engagement already exists for this client, service and period"
//       });
//     }

//     // -----------------------------
//     // 6. Get active task templates
//     // -----------------------------

//     const templates = await TaskTemplate.find({
//       serviceType,
//       isActive: true
//     })
//       .sort({ order: 1 })
//       .session(session);

//     if (templates.length === 0) {
//       await session.abortTransaction();

//       return res.status(400).json({
//         message:
//           "No active task templates found for this service"
//       });
//     }

//     // -----------------------------
//     // 7. Create engagement
//     // -----------------------------

//     const engagement = new Engagement({
//       client,
//       serviceType,
//       period,
//       startDate,
//       dueDate,
//       createdBy: req.user.userId
//     });

//     await engagement.save({ session });

//     // -----------------------------
//     // 8. Find users for assignment
//     // -----------------------------

//     const managers = await User.findOne({
//       role: "MANAGER",
//       isActive: true
//     }).session(session);

//     const teamMember = await User.findOne({
//       role: "TEAM_MEMBER",
//       isActive: true
//     }).session(session);

//     // -----------------------------
//     // 9. Create tasks
//     // -----------------------------

//     const tasks = [];

//     for (const template of templates) {
//       let assignedUser;

//       if (template.defaultAssigneeRole === "MANAGER") {
//         assignedUser = managers;
//       } else {
//         assignedUser = teamMember;
//       }

//       if (!assignedUser) {
//         await session.abortTransaction();

//         return res.status(400).json({
//           message:
//             `No active ${template.defaultAssigneeRole} found for task "${template.title}"`
//         });
//       }

//       const task = new Task({
//         engagement: engagement._id,
//         template: template._id,
//         assignedTo: assignedUser._id,
//         title: template.title,
//         description: template.description,
//         status: "NOT_STARTED",
//         dueDate
//       });

//       await task.save({ session });

//       tasks.push(task);
//     }

//     // -----------------------------
//     // 10. Commit transaction
//     // -----------------------------

//     await session.commitTransaction();

//     // -----------------------------
//     // 11. Return response
//     // -----------------------------

//     res.status(201).json({
//       message: "Engagement created successfully",
//       engagement,
//       tasks
//     });

//   } catch (error) {

//     // -----------------------------
//     // Rollback transaction
//     // -----------------------------

//     await session.abortTransaction();

//     // Duplicate key error
//     if (error.code === 11000) {
//       return res.status(409).json({
//         message:
//           "Engagement already exists for this client, service and period"
//       });
//     }

//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });

//   } finally {
//     // -----------------------------
//     // Close session
//     // -----------------------------

//     await session.endSession();
//   }
// };


// export const getEngagements = async (req, res) => {
//   try {
//     const engagements = await Engagement.find()
//       .populate("client", "name email")
//       .populate("serviceType", "name engagementType frequency")
//       .populate("createdBy", "name email role")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ engagements });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };