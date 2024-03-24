import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

// --------- Password ---------:
export const hashPassword = async (password: string) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "5");
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

// --------- Token ---------:
export const createJWT = (user: User) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
  console.log("creating token");
  return token;
};

// --------- Access control ---------:
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization as string;

  if (!bearer) {
    res.status(401);
    res.send({ message: "Not authorized" });
    return;
  }

  const [, token] = bearer.split(" "); //"bearer token"

  if (!token) {
    res.status(401);
    res.send({ message: "Not authorized" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.user = user;
    next();
  } catch (e) {
    res.status(401);
    res.json({ message: "Not valid token" });
    return;
  }
};
