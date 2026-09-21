import User from "../models/user.model.js";


// GET ACTIVE TEAM MEMBERS AND MANAGERS
export const getAssignableUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: {
        $in: ["TEAM_MEMBER", "MANAGER"],
      },
      isActive: true,
    })
      .select("_id name email role")
      .sort({ name: 1 });

    res.status(200).json({
      users,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


