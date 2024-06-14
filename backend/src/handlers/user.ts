import prisma from "../db";
import { hashPassword } from "../modules/auth";
import { NextFunction, Request, Response } from "express";
import { createJWT, comparePasswords } from "../modules/auth";

// Create new user and token:
export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(401);
      res.send({ message: "Invalid input or missing data" });
      return;
    }
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: await hashPassword(password),
      },
    });

    const token = createJWT(user);
    res.json({ token: token });
  } catch (e: any) {
    e.type = "input";
    console.log(e, "Unable to create new user");
    next(e);
  }
};

// Signin: Check if password is valid and create token:
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      res.status(401);
      res.send({ message: "Not registed" });
      return;
    }

    const isValid = await comparePasswords(req.body.password, user.password);
    if (!isValid) {
      res.status(401);
      res.send({ message: "Wrong password" });
      return;
    }

    const userName = user.name;

    const token = createJWT(user);
    res.json({ token: token, userName: userName });
  } catch (e) {
    console.log(e, "Unable to signin");
    next(e);
  }
};

// Get User Name:
export const userName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.user.id,
      },
    });
    if (!user) {
      res.send({ message: "User not found" });
    } else {
      res.json({ userName: user.name });
    }
  } catch (e) {
    console.log(e, "Unable to get user name");
    next(e);
  }
};

// FOR TESTING ONLY:
export const deleteUserTests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser) {
      await prisma.task.deleteMany({
        where: { belongsToId: existingUser.id },
      });
      await prisma.goal.deleteMany({
        where: { belongsToId: existingUser.id },
      });
      await prisma.progress.deleteMany({
        where: { progressBelongsToId: existingUser.id },
      });
      await prisma.user.delete({
        where: { id: existingUser.id },
      });
      res.json({ message: "user deleted from the database" });
    } else {
      res.json({ message: "user doesn't exist in the database" });
    }
  } catch (error) {
    console.log(error, "Unable to delete user from the DB");
    next(error);
  }
};

// FOR TESTING ONLY:
export const addUserTests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!existingUser) {
      const user = await prisma.user.upsert({
        where: { email: req.body.email },
        update: {},
        create: {
          email: req.body.email,
          name: "userTest",
          password: await hashPassword("passwordtest"),
          tasks: {
            create: [
              {
                description: "task 1",
                deadline: new Date(),
                status: "TO_DO",
                percentageCompleted: 0,
                priority: "MODERATE",
                category: "CAREER",
              },
              {
                description: "task 2",
                deadline: new Date(),
                status: "IN_PROGRESS",
                percentageCompleted: 50,
                priority: "HIGH",
                category: "LEISURE",
              },
            ],
          },
          goals: {
            create: [
              {
                description: "goal 1",
                month: 6,
                year: 2024,
                category: "CAREER",
                status: "NEEDS_IMPROVEMENT",
              },
              {
                description: "goal 2",
                month: 6,
                year: 2024,
                category: "LEISURE",
                status: "IN_PROGRESS",
              },
            ],
          },
        },
      });
      const token = createJWT(user);
      res.json({ token: token });
    }
  } catch (error) {
    console.log(error, "Unable to delete user from the DB");
    next(error);
  }
};
