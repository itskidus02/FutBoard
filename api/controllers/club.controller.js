import Club from "../models/club.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new club
export const createClub = async (req, res, next) => {
  try {
    const club = await Club.create(req.body);
    return res.status(201).json(club);
  } catch (error) {
    next(error);
  }
};

// Delete a club by ID
export const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return next(errorHandler(404, "Club not found!"));
    }

    // Check if the requester is an admin (assuming only admins can delete clubs)
    if (req.user) {
      await Club.findByIdAndDelete(req.params.id);
      res.status(200).json("Club has been deleted!");
    } else {
      return next(errorHandler(401, "You are not authorized to delete this club!"));
    }
  } catch (error) {
    next(error);
  }
};

// Update a club by ID
export const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return next(errorHandler(404, "Club not found!"));
    }

    const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedClub);
  } catch (error) {
    next(error);
  }
};

// Get a club by ID
export const getClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return next(errorHandler(404, "Club not found!"));
    }
    res.status(200).json(club);
  } catch (error) {
    next(error);
  }
};

// Get all clubs
export const getClubs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const clubs = await Club.find()
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(clubs);
  } catch (error) {
    next(error);
  }
};
