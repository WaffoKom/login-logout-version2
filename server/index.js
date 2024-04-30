import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectToDB } from "./database/db.connexion.js";
import { userAuthRoute } from "./routes/userAuthentification.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: [process.env.LOCALHOST],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

async function main() {
  app.use("/auth", userAuthRoute);

  await connectToDB();
  app.listen(PORT, () =>
    console.log(`Connexion etablit avec succes au port ${PORT}`)
  );
}

main();
