import TaskTemplate from "../models/taskTemplate.model.js";
import ServiceType from "../models/serviceType.model.js";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import Notification from "../models/notification.model.js";


// =====================================================
// CREATE TASK TEMPLATE
// =====================================================

export const createTaskTemplate = async (req, res) => {
  try {
    const {
      serviceType,
      title,
      description,
      order,
      estimatedDays,
      assignedTo,
      isActive,
    } = req.body;


    // --------------------------------
    // VALIDATION
    // --------------------------------

    if (
      !serviceType ||
      !title ||
      order === undefined ||
      !assignedTo
    ) {
      return res.status(400).json({
        message:
          "Service type, title, order and assigned user are required",
      });
    }


    // --------------------------------
    // CHECK SERVICE
    // --------------------------------

    const existingService =
      await ServiceType.findById(
        serviceType
      );

    if (!existingService) {
      return res.status(404).json({
        message:
          "Service type not found",
      });
    }


    // --------------------------------
    // CHECK ASSIGNED USER
    // --------------------------------

    const user =
      await User.findOne({
        _id: assignedTo,

        role: {
          $in: [
            "TEAM_MEMBER",
            "MANAGER",
          ],
        },

        isActive: true,
      });

    if (!user) {
      return res.status(400).json({
        message:
          "Selected user is not valid",
      });
    }


    // --------------------------------
    // CHECK DUPLICATE ORDER
    // --------------------------------

    const existingTemplate =
      await TaskTemplate.findOne({
        serviceType,
        order,
      });

    if (existingTemplate) {
      return res.status(409).json({
        message:
          "A task template with this order already exists for this service",
      });
    }


    // --------------------------------
    // CREATE TEMPLATE
    // --------------------------------

    const template =
      new TaskTemplate({

        serviceType,

        title,

        description,

        order,

        estimatedDays:
          estimatedDays || 1,

        assignedTo:
          user._id,

        isActive:
          isActive !== undefined
            ? isActive
            : true,
      });


    await template.save();


    // --------------------------------
    // POPULATE RESPONSE
    // --------------------------------

    await template.populate([
      {
        path: "serviceType",
        select:
          "name engagementType frequency",
      },
      {
        path: "assignedTo",
        select:
          "name email role",
      },
    ]);


    res.status(201).json({

      message:
        "Task template created successfully",

      template,

    });


  } catch (error) {

    console.error(
      "CREATE TASK TEMPLATE ERROR:",
      error
    );


    // Duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "A task template with this order already exists for this service",
      });
    }


    res.status(500).json({

      message:
        "Server error",

      error:
        error.message,

    });

  }
};


// =====================================================
// GET ALL TASK TEMPLATES
// =====================================================

export const getTaskTemplates = async (
  req,
  res
) => {

  try {

    const templates =
      await TaskTemplate.find()

        .populate(
          "serviceType",
          "name engagementType frequency"
        )

        .populate(
          "assignedTo",
          "name email role"
        )

        .sort({
          serviceType: 1,
          order: 1,
        });


    res.status(200).json({

      templates,

    });


  } catch (error) {

    console.error(
      "GET TASK TEMPLATES ERROR:",
      error
    );


    res.status(500).json({

      message:
        "Server error",

      error:
        error.message,

    });

  }
};


// =====================================================
// GET TASK TEMPLATES BY SERVICE
// =====================================================

export const getTemplatesByService = async (
  req,
  res
) => {

  try {

    const {
      serviceId,
    } = req.params;


    // --------------------------------
    // CHECK SERVICE
    // --------------------------------

    const service =
      await ServiceType.findById(
        serviceId
      );

    if (!service) {
      return res.status(404).json({
        message:
          "Service type not found",
      });
    }


    // --------------------------------
    // GET TEMPLATES
    // --------------------------------

    const templates =
      await TaskTemplate.find({
        serviceType:
          serviceId,
      })

        .populate(
          "assignedTo",
          "name email role"
        )

        .sort({
          order: 1,
        });


    res.status(200).json({

      templates,

    });


  } catch (error) {

    console.error(
      "GET TEMPLATES BY SERVICE ERROR:",
      error
    );


    res.status(500).json({

      message:
        "Server error",

      error:
        error.message,

    });

  }
};


// =====================================================
// UPDATE TASK TEMPLATE
// =====================================================

export const updateTaskTemplate = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      order,
      estimatedDays,
      assignedTo,
      isActive,
    } = req.body;


    // --------------------------------
    // FIND TEMPLATE
    // --------------------------------

    const template =
      await TaskTemplate.findById(
        req.params.id
      );

    if (!template) {
      return res.status(404).json({
        message:
          "Task template not found",
      });
    }


    // --------------------------------
    // UPDATE TITLE
    // --------------------------------

    if (title !== undefined) {

      template.title =
        title;

    }


    // --------------------------------
    // UPDATE DESCRIPTION
    // --------------------------------

    if (
      description !== undefined
    ) {

      template.description =
        description;

    }


    // --------------------------------
    // UPDATE ORDER
    // --------------------------------

    if (order !== undefined) {

      // Check if another template
      // already has this order
      const duplicate =
        await TaskTemplate.findOne({

          serviceType:
            template.serviceType,

          order,

          _id: {
            $ne:
              template._id,
          },

        });

      if (duplicate) {
        return res.status(409).json({
          message:
            "A task template with this order already exists for this service",
        });
      }


      template.order =
        order;
    }


    // --------------------------------
    // UPDATE ESTIMATED DAYS
    // --------------------------------

    if (
      estimatedDays !== undefined
    ) {

      template.estimatedDays =
        estimatedDays;

    }


    // --------------------------------
    // UPDATE ACTIVE STATUS
    // --------------------------------

    if (
      isActive !== undefined
    ) {

      template.isActive =
        isActive;

    }


    // --------------------------------
    // REASSIGN USER
    // --------------------------------

    if (
      assignedTo !== undefined
    ) {

      // Check selected user
      const user =
        await User.findOne({

          _id:
            assignedTo,

          role: {
            $in: [
              "TEAM_MEMBER",
              "MANAGER",
            ],
          },

          isActive:
            true,

        });


      if (!user) {

        return res.status(400).json({
          message:
            "Selected user is not valid",
        });

      }


      // --------------------------------
      // SET NEW ASSIGNEE
      // --------------------------------

      template.assignedTo =
        user._id;


      // --------------------------------
      // FIND EXISTING TASKS
      // --------------------------------

      const existingTasks =
        await Task.find({

          template:
            template._id,

        }).select(
          "_id title"
        );


      // --------------------------------
      // REASSIGN EXISTING TASKS
      // --------------------------------

      await Task.updateMany(

        {
          template:
            template._id,
        },

        {
          $set: {
            assignedTo:
              user._id,
          },
        }

      );


      // --------------------------------
      // CREATE NOTIFICATIONS
      // --------------------------------

      for (
        const task of existingTasks
      ) {

        await Notification.create({

          recipient:
            user._id,

          task:
            task._id,

          title:
            "Task Reassigned",

          message:
            `"${task.title}" has been assigned to you.`,

          type:
            "TASK_REASSIGNED",

        });

      }

    }


    // --------------------------------
    // SAVE TEMPLATE
    // --------------------------------

    await template.save();


    // --------------------------------
    // POPULATE RESPONSE
    // --------------------------------

    await template.populate([
      {
        path: "serviceType",
        select:
          "name engagementType frequency",
      },

      {
        path: "assignedTo",
        select:
          "name email role",
      },
    ]);


    // --------------------------------
    // RESPONSE
    // --------------------------------

    res.status(200).json({

      message:
        "Task template updated successfully",

      template,

    });


  } catch (error) {

    console.error(
      "UPDATE TASK TEMPLATE ERROR:",
      error
    );


    // Duplicate key error
    if (error.code === 11000) {

      return res.status(409).json({
        message:
          "A task template with this order already exists for this service",
      });

    }


    res.status(500).json({

      message:
        "Server error",

      error:
        error.message,

    });

  }
};

