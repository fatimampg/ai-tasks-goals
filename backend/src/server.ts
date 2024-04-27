import express, { NextFunction, Request, Response } from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./modules/auth";
import { createNewUser, signIn, userName } from "./handlers/user";
import cors from "cors";

const app = express();
// const allowedOrigins = ["http://localhost:..."];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
// };
// app.use(cors(options));
// app.use(cors());

app.use(morgan("dev")); //middleware to log requests
app.use(express.json()); //allow client to send json
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.json({ message: "hello" });
});

app.get("/", (req, res, next) => {
  console.log("hello from express");
  res.status(200);
  res.json({ message: "hello" });
});

app.use("/api", protect, router); //reject when there is no bearer token
app.post("/user", createNewUser);
app.post("/signin", signIn);

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
