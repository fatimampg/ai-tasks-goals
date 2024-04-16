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
    console.log(e, "Unable to tget user name");
    next(e);
  }
};