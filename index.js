import { config } from "dotenv";
config();
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import express from "express";
import serverless from "serverless-http";
//import AWS from 'aws-sdk';

const app = express();
app.use(express.json());

//const port = 3000;

app.get("/", (req, res) => {
  res.send("Bem-vindo à API!");
});

const sqsClient = new SQSClient({ region: "us-east-1" });
const queueUrl =
  "https://sqs.us-east-1.amazonaws.com/533267034838/fila-desafio-aws.fifo";
app.post("/transaction", async (req, res) => {
  const { idempotencyId, amount, type } = req.body;

  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({ idempotencyId, amount, type }),
    MessageGroupId: "TransactionGroup",
    MessageDeduplicationId: idempotencyId,
  };

  console.log("Enviando mensagem para a fila SQS:", params);

  try {
    const command = new SendMessageCommand(params);
    const data = await sqsClient.send(command);
    console.log("Mensagem enviada com sucesso, ID:", data.MessageId);
    res.json({
      message: "Transação enviada para a fila com sucesso!",
      messageId: data.MessageId,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila SQS:", error);
    res.status(500).send("Erro ao enviar a transação para a fila");
  }
});

/* app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});  */
export const handler = serverless(app);
