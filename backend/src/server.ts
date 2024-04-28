import express, { NextFunction, Request, Response } from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./modules/auth";
import { createNewUser, signIn, userName } from "./handlers/user";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: process.env.REACT_APP_URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(morgan("dev")); //middleware to log requests
app.use(express.json()); //allow client to send json
app.use(express.urlencoded({ extended: true }));

app.options("*", (req, res) => {
  const origin = req.headers.origin; // Get the origin from the request headers
  res.set("Access-Control-Allow-Origin", origin);
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set(200).end();
});


app.get("/", (req, res, next) => {
  console.log("hello from express");
  res.status(200);
  res.json({ message: "hello" });
});

app.use("/api", protect, router); //reject when there is no bearer token
app.post("/user", createNewUser);
app.post("/signin", signIn);

// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     process.env.REACT_APP_URL as string,
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS",
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use((e: any, req: Request, res: Response, next: NextFunction) => {
  if (e.type === "auth") {
    res.status(401).json({ message: "unauthorized" });
  } else if (e.type === "input") {
    res.status(400).json({ message: "invalid input" });
  } else {
    res.status(500).json({ message: "ooops thats on us" });
  }
});

export default app;
