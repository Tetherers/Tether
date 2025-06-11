import express from "express";
import router from "./router.js";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // allow your frontend
  credentials: true, // if you use cookies or auth headers
}));
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});