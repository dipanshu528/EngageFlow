import Notification from "../models/notification.model.js";


// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

export const getNotifications = async (
  req,
  res
) => {
  try {

    const notifications =
      await Notification.find({
        recipient:
          req.user.userId,
      })

        .populate(
          "task",
          "title status dueDate"
        )

        .sort({
          createdAt: -1,
        })

        .limit(50);


    const unreadCount =
      await Notification.countDocuments({
        recipient:
          req.user.userId,

        isRead:
          false,
      });


    res.status(200).json({

      notifications,

      unreadCount,

    });


  } catch (error) {

    console.error(
      "GET NOTIFICATIONS ERROR:",
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
// MARK ONE NOTIFICATION AS READ
// =====================================================

export const markNotificationAsRead =
  async (req, res) => {

    try {

      const {
        id,
      } = req.params;


      const notification =
        await Notification.findOneAndUpdate(

          {
            _id:
              id,

            recipient:
              req.user.userId,
          },

          {
            $set: {
              isRead:
                true,
            },
          },

          {
            new:
              true,
          }

        );


      if (!notification) {

        return res.status(404).json({
          message:
            "Notification not found",
        });

      }


      res.status(200).json({

        message:
          "Notification marked as read",

        notification,

      });


    } catch (error) {

      console.error(
        "MARK NOTIFICATION ERROR:",
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
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

export const markAllNotificationsAsRead =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {
          recipient:
            req.user.userId,

          isRead:
            false,
        },

        {
          $set: {
            isRead:
              true,
          },
        }

      );


      res.status(200).json({

        message:
          "All notifications marked as read",

      });


    } catch (error) {

      console.error(
        "MARK ALL NOTIFICATIONS ERROR:",
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








// import Notification from "../models/notification.model.js";

// // GET MY NOTIFICATIONS
// export const getNotifications = async (req, res) => {
//   try {
//     const notifications =
//       await Notification.find({
//         recipient: req.user.userId,
//       })
//         .populate(
//           "task",
//           "title status dueDate"
//         )
//         .sort({
//           createdAt: -1,
//         })
//         .limit(50);

//     const unreadCount =
//       await Notification.countDocuments({
//         recipient: req.user.userId,
//         isRead: false,
//       });

//     res.status(200).json({
//       notifications,
//       unreadCount,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// // MARK ONE NOTIFICATION AS READ
// export const markNotificationAsRead = async (
//   req,
//   res
// ) => {
//   try {
//     const { id } = req.params;

//     const notification =
//       await Notification.findOneAndUpdate(
//         {
//           _id: id,
//           recipient: req.user.userId,
//         },
//         {
//           $set: {
//             isRead: true,
//           },
//         },
//         {
//           new: true,
//         }
//       );

//     if (!notification) {
//       return res.status(404).json({
//         message: "Notification not found",
//       });
//     }

//     res.status(200).json({
//       message: "Notification marked as read",
//       notification,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// // MARK ALL NOTIFICATIONS AS READ
// export const markAllNotificationsAsRead = async (
//   req,
//   res
// ) => {
//   try {
//     await Notification.updateMany(
//       {
//         recipient: req.user.userId,
//         isRead: false,
//       },
//       {
//         $set: {
//           isRead: true,
//         },
//       }
//     );

//     res.status(200).json({
//       message:
//         "All notifications marked as read",
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };