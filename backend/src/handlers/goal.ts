import prisma from "../db";
import { NextFunction, Request, Response } from "express";

// ------------- Get all goals -------------
export const getGoals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.user.id,
      },
      include: {
        goals: true,
      },
    });
    if (!user) {
      res.json({ message: "User not found" });
    } else {
      res.json({ data: user.goals });
    }
  } catch (e) {
    console.log(e, "Unable to get goals from the DB");
    next(e);
  }
};

// ------------- Get goals associated to a specific month -------------
export const getMonthlyGoals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        belongsToId: req.body.user.id,
        month: +req.body.month,
        year: +req.body.year,
      },
    });

    if (!goals) {
      res.json({ message: "No goals set for this month" });
    } else {
      res.json({ data: goals });
    }
  } catch (e) {
    console.log(e, "Unable to get goals from the DB");
    next(e);
  }
};

// ------------- Get a specific goal -------------
export const getOneGoal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const goal = await prisma.goal.findUnique({
      where: {
        id: +req.params.id,
        belongsToId: req.body.user.id,
      },
    });
    if (!goal) {
      res.json({ message: "Goal not found" });
    } else {
      res.json({ data: goal });
    }
  } catch (e) {
    console.log(e, "Unable to get goal from the DB");
    next(e);
  }
};

// ------------- Add new goal -------------
export const createGoal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const goal = await prisma.goal.create({
      data: {
        description: req.body.description,
        month: +req.body.month,
        year: +req.body.year,
        belongsToId: req.body.user.id,
        category: req.body.category,
      },
    });
    res.json({ data: goal });
  } catch (e) {
    console.log(e, "Unable to add goal to the DB");
    next(e);
  }
};

// ------------- Update a task -------------
export const updateGoal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedGoal = await prisma.goal.update({
      where: {
        id: +req.params.id,
        belongsToId: req.body.user.id,
      },
      data: {
        description: req.body.description,
        month: +req.body.month,
        year: +req.body.year,
        category: req.body.category,
      },
    });
    res.json(updatedGoal);
  } catch (e) {
    console.log(e, "Unable to update goal");
    next(e);
  }
};

// ------------- Delete a specific goal -------------
export const deleteOneGoal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deletedGoal = await prisma.goal.delete({
      where: {
        id: +req.params.id,
        belongsToId: req.body.user.id,
      },
    });
    res.json({ data: deletedGoal });
  } catch (e) {
    console.log(e, "Unable to delete goal from the DB");
    next(e);
  }
};
