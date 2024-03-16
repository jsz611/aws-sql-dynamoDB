import dotenv from "dotenv";
dotenv.config();
import express from "express";
import AWS from "aws-sdk";
import serverless from "serverless-http";

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const app = express();
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
const queueUrl = process.env.SQS_QUEUE_URL;

app.use(express.json());

app.post("/transaction", async (req, res) => {
  const { idempotencyId, amount, type } = req.body;

  const messageDeduplicationId = idempotencyId;

  const params = {
    MessageBody: JSON.stringify({ idempotencyId, amount, type }),
    QueueUrl: queueUrl,
    MessageGroupId: "YourMessageGroupId",
    MessageDeduplicationId: messageDeduplicationId,
  };

  try {
    const sendMessageResult = await sqs.sendMessage(params).promise();
    res.json({
      message: "Transação enviada para a fila SQS com sucesso!",
      MessageId: sendMessageResult.MessageId,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila SQS:", error);
    res.status(500).send("Erro ao enviar a transação para a fila SQS");
  }
});

AWS.config.logger = console;

// Para executar localmente, descomente a linha abaixo:
const port = 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});

// Para executar na AWS Lambda, use o seguinte:
export const handler = serverless(app);
