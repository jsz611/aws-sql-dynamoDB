import express from "express";
import { sendMessage } from "../services/sqsService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { idempotencyId, amount, type } = req.body;
  try {
    const result = await sendMessage({ idempotencyId, amount, type });
    res.json({ message: "Mensagem enviada para a fila SQS com sucesso!", data: result });
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila SQS:", error);
    res.status(500).send("Erro ao enviar a mensagem para a fila SQS");
  }
});

export default router; 
