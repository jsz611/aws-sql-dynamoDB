import express from "express";
import { sendMessage } from "../services/sqsService.js";
import { fetchAllTransactions } from "../services/dynamodbClient.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { idempotencyId, amount, type } = req.body;
  try {
    const result = await sendMessage({ idempotencyId, amount, type });
    res.json({
      message: "Mensagem enviada para a fila SQS com sucesso!",
      data: result,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila SQS:", error);
    res.status(500).send("Erro ao enviar a mensagem para a fila SQS");
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const transactions = await fetchAllTransactions();
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar transações", error: error.message });
  }
});
export default router;
