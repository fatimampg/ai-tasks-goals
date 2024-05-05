import { CATEGORY, TASK_PRIORITY, TASK_STATUS, Task } from "@prisma/client";
import prisma from "../db";
import { NextFunction, Request, Response } from "express";

// ------------- Get all tasks -------------
export const getTasks = async (
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
        tasks: true,
      },
    });
    if (!user) {
      res.json({ message: "User not found" });
    } else {
      res.json({ data: user.tasks });
    }
  } catch (e) {
    console.log(e, "Unable to get tasks from DB");
    next(e);
  }
};

// ------------- Get all tasks between dates -------------
export const getTasksTimeInterval = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const gteDate = req.query.gte ? String(req.query.gte) : undefined;
    const lteDate = req.query.lte ? String(req.query.lte) : undefined;

    // console.log(
    //   "Query param received (BE) - gteDate:",
    //   gteDate,
    //   "lteDate:",
    //   lteDate,
    // );
    const tasks = await prisma.task.findMany({
      where: {
        belongsToId: req.body.user.id,
        deadline: {
          gte: gteDate,
          lte: lteDate,
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });
    if (!tasks) {
      res.json({ message: "No tasks found" });
    } else {
      res.json({ data: tasks });
    }
  } catch (e) {
    console.log(e, "Unable to get tasks from the DB, within that period");
    next(e);
  }
};

// ------------- Get a specific task -------------
export const getOneTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: +req.params.id,
        belongsToId: req.body.user.id,
      },
    });
    if (!task) {
      res.json({ message: "Task not found" });
    } else {
      res.json({ data: task });
    }
  } catch (e) {
    console.log(e, "Unable to get task from the DB");
    next(e);
  }
};

// ------------- Add new task -------------
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("userId from the BE", req.body.user.id);
    console.log("description from the BE", req.body.description);
    // console.log("req", req);
    const task = await prisma.task.create({
      data: {
        description: req.body.description,
        priority: req.body.priority,
        category: req.body.category,
        deadline: req.body.deadline, //execting format: "YYYY-MM-DDTHH:MM:SSZ"
        belongsToId: req.body.user.id,
      },
    });
    res.json({ data: task });
  } catch (e) {
    console.log(e, "Unable to add task to the DB");
    next(e);
  }
};

// ------------- Update a task -------------
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: {
      id: number;
      description: string;
      deadline: Date;
      priority: TASK_PRIORITY;
      category: CATEGORY;
      status: TASK_STATUS;
      percentageCompleted?: number;
    } = {
      id: req.body.id,
      description: req.body.description,
      deadline: req.body.deadline,
      priority: req.body.priority,
      category: req.body.category,
      status: req.body.status,
    };
    if (req.body.percentageCompleted !== undefined) {
      data.percentageCompleted = req.body.percentageCompleted;
    }
    const taskUpdated = await prisma.task.update({
      where: {
        id: +req.params.id,
        belongsToId: req.body.user.id,
      },
      data: data,
    });
    res.json(taskUpdated);
  } catch (e) {
    console.log(e, "Unable to update task");
    next(e);
  }
};
// ------------- Update the status of a list of tasks -------------
export const updateTasksStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tasks: {
      id: number;
      status: TASK_STATUS;
      percentageCompleted?: number;
    }[] = req.body.data;

    // console.log("req.body", req.body);
    console.log("req.body.data", req.body.data);

    const updatedtaskList = await prisma.$transaction(
      tasks.map((task) =>
        prisma.task.update({
          where: {
            id: task.id,
            belongsToId: req.body.user.id,
          },
          data: {
            status: task.status,
            percentageCompleted: task.percentageCompleted,
          },
        }),
      ),
    );
    res.json(updatedtaskList);
  } catch (e) {
    console.log(e, "Unable to update task");
    next(e);
  }
};

// ------------- Delete a specific task -------------
export const deleteOneTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: +req.params.id,
        belongsToId: req.body.user.id,
      },
    });
    res.json({ data: deletedTask });
  } catch (e) {
    console.log(e, "Unable to delete task from the DB");
    next(e);
  }
};
