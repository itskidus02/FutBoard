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
    if (req.user.id === table.userId.toString()) {
      await Table.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Table has been deleted!" });
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

export const updateMatchResult = async (req, res, next) => {
  try {
    const { tableId, homeClubId, awayClubId, homeGoals, awayGoals, matchDate } = req.body;
    const table = await Table.findById(tableId);

    if (!table) {
      return next(errorHandler(404, "Table not found!"));
    }

    // Check if the authenticated user is the creator of the table
    if (req.user.id !== table.userId.toString()) {
      return next(errorHandler(401, "You can only update the match result for your own tables!"));
    }

    // Find clubs in the table and update their stats based on match result
    const homeClub = table.clubs.find(club => club.clubId.toString() === homeClubId);
    const awayClub = table.clubs.find(club => club.clubId.toString() === awayClubId);

    if (!homeClub || !awayClub) {
      return next(errorHandler(404, "Clubs not found in the table!"));
    }

    // Update match stats
    homeClub.played++;
    awayClub.played++;
    homeClub.goalsScored += parseInt(homeGoals);
    homeClub.goalsConceded += parseInt(awayGoals);
    awayClub.goalsScored += parseInt(awayGoals);
    awayClub.goalsConceded += parseInt(homeGoals);

    // Determine match result (win, lose, draw) and update points
    if (homeGoals > awayGoals) {
      homeClub.won++;
      awayClub.lost++;
      homeClub.points += 3;
    } else if (awayGoals > homeGoals) {
      awayClub.won++;
      homeClub.lost++;
      awayClub.points += 3;
    } else {
      homeClub.drawn++;
      awayClub.drawn++;
      homeClub.points++;
      awayClub.points++;
    }

    // Update goal difference
    homeClub.goalDifference = homeClub.goalsScored - homeClub.goalsConceded;
    awayClub.goalDifference = awayClub.goalsScored - awayClub.goalsConceded;

    // Add match to matches array
    table.matches.push({
      homeClubId,
      awayClubId,
      homeGoals,
      awayGoals,
      matchDate: new Date(matchDate)
    });

    // Save table updates
    await table.save();

    res.status(200).json(table);
  } catch (error) {
    next(error);
  }
};



// Update clubs in a table
// Update clubs in a table
export const updateClubsInTable = async (req, res, next) => {
  try {
    const { tableId, clubs } = req.body;
    const table = await Table.findById(tableId);

    if (!table) {
      return next(errorHandler(404, "Table not found!"));
    }

    if (req.user.id !== table.userId.toString()) {
      return next(errorHandler(401, "You can only update your own tables!"));
    }

    // Remove existing clubs not present in the new clubs array
    for (const club of table.clubs) {
      if (!clubs.some((newClub) => newClub.clubId === club.clubId.toString())) {
        await Club.findByIdAndDelete(club.clubId);
      }
    }

    // Add or update clubs
    for (const clubData of clubs) {
      if (clubData.logoUrl) {
        await Club.findByIdAndUpdate(clubData.clubId, { name: clubData.name, logoUrl: clubData.logoUrl }, { upsert: true });
      } else {
        await Club.findByIdAndUpdate(clubData.clubId, { name: clubData.name }, { upsert: true });
      }
    }

    // Update table clubs array
    table.clubs = clubs.map((club) => ({ clubId: club.clubId }));
    await table.save();

    res.status(200).json({ success: true, message: "Clubs updated successfully!" });
  } catch (error) {
    next(error);
  }
};

