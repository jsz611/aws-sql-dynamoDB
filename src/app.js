import express from "express";
import dotenv from "dotenv";
import transactionsRouter from "./api/transactions.js";
import cors from "cors";

const app = express();
app.use(cors());
dotenv.config();

app.use(express.json());

app.use("/transaction", transactionsRouter);
app.use("/api", transactionsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});

export default app;
