import express, { urlencoded } from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieparser());

//import routers
import userRouter from "./routes/user.router.js";

app.use("/api/v1/users", userRouter);

export { app };
