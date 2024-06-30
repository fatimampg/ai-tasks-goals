import { Router } from "express";
import { body } from "express-validator";
import { NextFunction, Request, Response } from "express";
import {
  createTask,
  deleteOneTask,
  getOneTask,
  getTasks,
  getTasksTimeInterval,
  updateTask,
  updateTasksStatus,
} from "./handlers/task";
import { handleErrors } from "./modules/middleware";
import {
  createGoal,
  deleteOneGoal,
  getGoals,
  getMonthlyGoals,
  getOneGoal,
  updateGoal,
  updateMonthlyGoalsStatus,
} from "./handlers/goal";
import {
  getMonthlyProgress,
  analyseProgress,
  addProgress,
  updateProgress,
} from "./handlers/progress";
import { userName } from "./handlers/user";

const router = Router();

// Get user name
router.get("/username", handleErrors, userName);

//----------------- TASKS -------------------

// Get all tasks associated to a specific user
router.get("/task", handleErrors, getTasks);

// Get a specific task (id)
router.get("/task/:id", handleErrors, getOneTask);

// Get all tasks between dates:
router.get("/taskint", handleErrors, getTasksTimeInterval);

//Update a specific task
router.put(
  "/task/:id",
  [body("description").isString(), body("deadline").isString()],
  handleErrors,
  updateTask,
);
//Update status of a list of tasks:
router.put("/tasklist", handleErrors, updateTasksStatus);

//Add new task
router.post(
  "/task",
  [body("description").isString(), body("deadline").isString()],
  handleErrors,
  createTask,
);

//Delete a specific task
router.delete("/task/:id", handleErrors, deleteOneTask);

//----------------- GOALS -------------------

//Get all goals:
router.get("/goal", handleErrors, getGoals);

//Get a specific goal (id)
router.get("/goal/:id", handleErrors, getOneGoal);

// Get goals associated to a specific month:
router.get("/goalmonth", handleErrors, getMonthlyGoals);

//Update a specific goal
router.put(
  "/goal/:id",
  [body("description").isString(), body("month").isInt(), body("year").isInt()],
  handleErrors,
  updateGoal,
);

//Add new goal
router.post(
  "/goal",
  [
    body("description").isString(),
    body("month").isInt(),
    body("year").isInt(),
    body("category").isIn([
      "CAREER",
      "PERSONAL_DEVELOPMENT",
      "HEALTH_AND_WELLNESS",
      "FINANCIAL",
      "FAMILY_AND_FRIENDS",
      "LEISURE",
    ]),
  ],
  handleErrors,
  createGoal,
);

//Delete a specific goal
router.delete("/goal/:id", handleErrors, deleteOneGoal);

//Update status of a list of goals:
router.put("/goallist", handleErrors, updateMonthlyGoalsStatus);

//----------------- PROGRESS -------------------

//Get Progress associated to a specific month:
router.get("/progressmonth", handleErrors, getMonthlyProgress);

//Add new progress to the database:
router.post(
  "/addprogress",
  [
    body("month").isInt(),
    body("year").isInt(),
    body("summary").isString(),
    body("recommendations").isString(),
  ],
  handleErrors,
  addProgress,
);

// Update a specific progress analysis in the database
router.put(
  "/progress/:id",
  [
    body("summary").isString(),
    body("recommendations").isString(),
    body("month").isInt(),
    body("year").isInt(),
  ],
  handleErrors,
  updateProgress,
);

// Request AI Progress analysis
router.get("/analyse", handleErrors, analyseProgress);

// Error:
router.use((e: any, req: Request, res: Response, next: NextFunction) => {
  console.log(e);
  res.json({ message: "in router handler" });
});

export default router;