import express from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";
import cors from "cors";

const app = express();
// const allowedOrigins = ["http://localhost:..."];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
// };
// app.use(cors(options));
app.use(cors());


app.use(morgan("dev")); //middleware to log requests
app.use(express.json()); //allow client to send json
app.use(express.urlencoded({ extended: true }));

app.use("/api", protect, router); //reject when there is no bearer token
app.post("/user", createNewUser);
app.post("/signin", signIn);

export default app;
