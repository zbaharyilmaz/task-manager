const Task = require("../models/Tasks");
const User = require("../models/User");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, todoCheckList } =
      req.body;

    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      dueDate,
      assignedTo: assignedTo || [],
      createdBy: req.user.id,
      todoCheckList: todoCheckList || [],
    });

    // Populate assigned users
    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully! 🎯",
      data: { task },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task! 😢",
      error: error.message,
    });
  }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    let filter = {};

    // Apply filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // If user is not admin, only show their tasks
    if (req.user.role !== "admin") {
      filter.$or = [{ createdBy: req.user.id }, { assignedTo: req.user.id }];
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully! 📋",
      data: { tasks, count: tasks.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks! 😢",
      error: error.message,
    });
  }
};

// Get Single Task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found! 🤷‍♂️",
      });
    }

    // Check if user has access to this task
    if (
      req.user.role !== "admin" &&
      task.createdBy._id.toString() !== req.user.id &&
      !task.assignedTo.some((user) => user._id.toString() === req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied! 🚫",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully! 📄",
      data: { task },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch task! 😢",
      error: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      todoCheckList,
    } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found! 🤷‍♂️",
      });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Only task creator or admin can update! 🚫",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title || task.title,
        description: description || task.description,
        priority: priority || task.priority,
        status: status || task.status,
        dueDate: dueDate || task.dueDate,
        assignedTo: assignedTo || task.assignedTo,
        todoCheckList: todoCheckList || task.todoCheckList,
      },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully! ✨",
      data: { task: updatedTask },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task! 😢",
      error: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found! 🤷‍♂️",
      });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Only task creator or admin can delete! 🚫",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully! 🗑️",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task! 😢",
      error: error.message,
    });
  }
};

// Update Task Status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found! 🤷‍♂️",
      });
    }

    // Check if user is assigned to this task or is admin
    if (
      req.user.role !== "admin" &&
      !task.assignedTo.includes(req.user.id) &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update tasks assigned to you! 🚫",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task status updated successfully! 🔄",
      data: { task: updatedTask },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task status! 😢",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
