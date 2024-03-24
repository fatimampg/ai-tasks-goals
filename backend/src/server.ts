import express from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";

const app = express();

app.use(morgan("dev")); //middleware to log requests
app.use(express.json()); //allow client to send json
app.use(express.urlencoded({ extended: true }));

app.use("/api", protect, router); //reject when there is no bearer token
app.post("/user", createNewUser);
app.post("/signin", signIn);

export default app;
