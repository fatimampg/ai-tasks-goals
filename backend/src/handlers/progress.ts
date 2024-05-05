import { Task, Goal, Progress } from "@prisma/client";
import prisma from "../db";
import { NextFunction, Request, Response } from "express";
import { analyze } from "../modules/ai";

// ------------- Get Progress associated to a specific month and year -------------
export const getMonthlyProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const month = req.query.month ? Number(req.query.month) : undefined; //received as params
    const year = req.query.year ? Number(req.query.year) : undefined; //received as params

    const progress = await prisma.progress.findMany({
      where: {
        progressBelongsToId: req.body.user.id,
        month: month,
        year: year,
      },
    });

    if (!progress) {
      res.json({ message: "No progress analysis found" });
    } else {
      res.json({ data: progress });
    }
  } catch (e) {
    console.log(e, "Unable to get progress analysis from the DB");
    next(e);
  }
};

// ------------- Add progress summary and recommendatios -------------
export const addProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const addedProgress = await prisma.progress.create({
      data: {
        month: +req.body.month,
        year: +req.body.year,
        summary: req.body.summary,
        recommendations: req.body.recommendations,
        progressBelongsToId: req.body.user.id,
      },
    });
    res.json(addedProgress);
    console.log(
      "From the BE - PROGRESS UPDATED IN THE DATABASE:",
      addedProgress,
    );
  } catch (e) {
    console.log(e, "Unable to add progress");
    next(e);
  }
};

// ------------- Update progress summary and recommendatios -------------

export const updateProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: {
      id: number;
      month: number;
      year: number;
      summary: string;
      recommendations: string;
    } = {
      id: req.body.id,
      month: +req.body.month,
      year: +req.body.year,
      summary: req.body.summary,
      recommendations: req.body.recommendations,
    };
    console.log("input data", data);
    const updatedProgress = await prisma.progress.update({
      where: {
        id: +req.params.id,
        progressBelongsToId: req.body.user.id, // available in auth header
      },
      data: data,
    });
    res.json(updatedProgress);
    console.log(
      "From the BE - PROGRESS UPDATED IN THE DATABASE:",
      updatedProgress,
    );
  } catch (e) {
    console.log(e, "Unable to update progress");
    next(e);
  }
};

//----------- Request new AI progress analysis ---------------

export const analyseProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tasks, goals } = req.body;
    const combinedData = {
      tasks: tasks.map((task: Task) => ({
        id: task.id,
        description: task.description,
        deadline: task.deadline,
        belongsToId: task.belongsToId,
        status: task.status,
        percentageCompleted: task.percentageCompleted,
        priority: task.priority,
        relatedGoalId: task.relatedGoalId,
        category: task.category,
      })),
      goals: goals.map((goal: Partial<Goal>) => ({
        id: goal.id,
        description: goal.description,
        month: goal.month,
        year: goal.year,
        belongsToId: goal.belongsToId,
        category: goal.category,
      })),
    };
    const jsonStringCombinedData = JSON.stringify(combinedData);

    console.log("jsonStringCombinedData", jsonStringCombinedData);
    const analysis = await analyze(jsonStringCombinedData);

    console.log("FROM THE BE: result of the AI analysis", analysis);

    res.json({ data: analysis });
  } catch (e) {
    console.log(e, "Unable to analyse tasks and goals lists");
    next(e);
  }
};
