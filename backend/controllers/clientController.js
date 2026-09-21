import Client from "../models/client.model.js";

// CREATE CLIENT
export const createClient = async (req, res) => {
  try {
    const {
      name,
      tradeName,
      email,
      phone,
      gstin,
      pan,
      registrationType,
      filingFrequency,
      state,
      address,
      authorizedSignatory,
      gstStatus,
    } = req.body;

    if (!name || !email || !gstin || !state) {
      return res.status(400).json({
        message: "Name, email, GSTIN and state are required",
      });
    }

    const existingClient = await Client.findOne({
      gstin: gstin.toUpperCase().trim(),
    });

    if (existingClient) {
      return res.status(409).json({
        message: "Client with this GSTIN already exists",
      });
    }

    const client = await Client.create({
      name,
      tradeName,
      email,
      phone,
      gstin,
      pan,
      registrationType,
      filingFrequency,
      state,
      address,
      authorizedSignatory,
      gstStatus,
    });

    res.status(201).json({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Client with this GSTIN already exists",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL CLIENTS
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      clients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE CLIENT
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.status(200).json({
      client,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE CLIENT
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      tradeName,
      email,
      phone,
      gstin,
      pan,
      registrationType,
      filingFrequency,
      state,
      address,
      authorizedSignatory,
      gstStatus,
      status,
    } = req.body;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    // If GSTIN is being changed, make sure it doesn't collide with another client
    if (gstin !== undefined && gstin.toUpperCase().trim() !== client.gstin) {
      const gstinInUse = await Client.findOne({
        gstin: gstin.toUpperCase().trim(),
        _id: { $ne: id },
      });

      if (gstinInUse) {
        return res.status(409).json({
          message: "Another client already uses this GSTIN",
        });
      }

      client.gstin = gstin;
    }

    if (name !== undefined) client.name = name;
    if (tradeName !== undefined) client.tradeName = tradeName;
    if (email !== undefined) client.email = email;
    if (phone !== undefined) client.phone = phone;
    if (pan !== undefined) client.pan = pan;
    if (registrationType !== undefined) client.registrationType = registrationType;
    if (filingFrequency !== undefined) client.filingFrequency = filingFrequency;
    if (state !== undefined) client.state = state;
    if (address !== undefined) client.address = address;
    if (authorizedSignatory !== undefined) client.authorizedSignatory = authorizedSignatory;
    if (gstStatus !== undefined) client.gstStatus = gstStatus;
    if (status !== undefined) client.status = status;

    await client.save();

    res.status(200).json({
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Another client already uses this GSTIN",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE CLIENT
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    await Client.findByIdAndDelete(id);

    res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};