import express from "express";
import dotenv from "dotenv";
import transactionsRouter from "./api/transactions.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/transaction", transactionsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});

export default app;
