import ServiceType from "../models/serviceType.model.js";


// CREATE SERVICE
export const createService = async (req, res) => {
  try {
    const {
      name,
      engagementType,
      frequency,
      description
    } = req.body;

    if (!name || !engagementType) {
      return res.status(400).json({
        message: "Name and engagement type are required"
      });
    }

    // Frequency required for recurring services
    if (engagementType === "RECURRING" && !frequency) {
      return res.status(400).json({
        message: "Frequency is required for recurring services"
      });
    }

    // Frequency should not be provided for one-time services
    if (engagementType === "ONE_TIME") {
      if (frequency) {
        return res.status(400).json({
          message: "One-time services cannot have a frequency"
        });
      }
    }

    const existingService = await ServiceType.findOne({
      name
    });

    if (existingService) {
      return res.status(409).json({
        message: "Service already exists"
      });
    }

    const service = await ServiceType.create({
      name,
      engagementType,
      frequency: engagementType === "RECURRING"
        ? frequency
        : null,
      description
    });

    res.status(201).json({
      message: "Service created successfully",
      service
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// GET ALL SERVICES
export const getServices = async (req, res) => {
  try {
    const services = await ServiceType.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      services
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// GET SERVICE BY ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await ServiceType.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.status(200).json({
      service
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// UPDATE SERVICE
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      engagementType,
      frequency,
      description,
      isActive
    } = req.body;

    const service = await ServiceType.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    if (name !== undefined) {
      service.name = name;
    }

    if (engagementType !== undefined) {
      service.engagementType = engagementType;
    }

    if (frequency !== undefined) {
      service.frequency = frequency;
    }

    if (description !== undefined) {
      service.description = description;
    }

    if (isActive !== undefined) {
      service.isActive = isActive;
    }

    await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      service
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};