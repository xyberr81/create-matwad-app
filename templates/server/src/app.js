import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express Server!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
