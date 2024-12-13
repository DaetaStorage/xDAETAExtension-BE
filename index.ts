import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotevnv.config();

// Import Routes
import users from "./routes/users";
import onchain from "./routes/onchain";
import x from "./routes/x";

if (!process.env.PORT) {
  console.log(`No port value specified...`);
  process.exit(1);
}

// Connect Mongo DB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 7005;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set up Routes
app.use("/api/users", users);
app.use("/api/onchain", onchain);
app.use("/api/x", x);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
