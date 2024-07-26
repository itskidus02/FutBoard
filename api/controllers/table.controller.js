import Table from "../models/table.model.js";
import Club from "../models/club.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new table
export const createTable = async (req, res, next) => {
  try {
    const table = await Table.create(req.body);
    return res.status(201).json(table);
  } catch (error) {
    next(error);
  }
};

// Create clubs and add them to a table
export const addClubsToTable = async (req, res, next) => {
  try {
    const { tableId, clubs } = req.body;
    const table = await Table.findById(tableId);

    if (!table) {
      return next(errorHandler(404, "Table not found!"));
    }

    const clubIds = [];
    for (const clubData of clubs) {
      const club = await Club.create({ name: clubData.name, logoUrl: clubData.logoUrl });
      clubIds.push({ clubId: club._id });
    }

    table.clubs = clubIds;
    await table.save();

    res.status(200).json(table);
  } catch (error) {
    next(error);
  }
};


// Delete a table by ID
export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return next(errorHandler(404, "Table not found!"));
    }

    // Check if the requester is the owner of the table or an admin
    if (req.user.isAdmin || req.user.id === table.userId.toString()) {
      await Table.findByIdAndDelete(req.params.id);
      res.status(200).json("Table has been deleted!");
    } else {
      return next(errorHandler(401, "You are not authorized to delete this table!"));
    }
  } catch (error) {
    next(error);
  }
};

// Update a table by ID
export const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return next(errorHandler(404, "Table not found!"));
    }
    if (req.user.id !== table.userId.toString()) {
      return next(errorHandler(401, "You can only update your own tables!"));
    }

    const updatedTable = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTable);
  } catch (error) {
    next(error);
  }
};

// Get a table by ID
export const getTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id).populate('userId').populate('clubs.clubId');
    if (!table) {
      return next(errorHandler(404, "Table not found!"));
    }
    res.status(200).json(table);
  } catch (error) {
    next(error);
  }
};

// Get all tables
export const getTables = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const tables = await Table.find()
      .populate('userId')
      .populate('clubs.clubId')
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(tables);
  } catch (error) {
    next(error);
  }
};


// table.controller.js

// Get tables by user ID
export const getTablesByUser = async (req, res, next) => {
  try {
    const tables = await Table.find({ userId: req.params.userId }).populate('userId').populate('clubs.clubId');
    if (!tables) {
      return next(errorHandler(404, "Tables not found!"));
    }
    res.status(200).json(tables);
  } catch (error) {
    next(error);
  }
};
