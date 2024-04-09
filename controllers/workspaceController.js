

const Workspace = require('../models/workspaceModel');

// Controller methods
exports.createWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        workspace
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        workspace
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteWorkspace = async (req, res) => {
  try {
    await Workspace.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


// Method to fetch all workspaces
exports.getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find();
    res.status(200).json({
      status: 'success',
      results: workspaces.length,
      data: {
        workspaces
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Method to fetch a single workspace by ID
exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({
        status: 'fail',
        message: 'Workspace not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        workspace
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

