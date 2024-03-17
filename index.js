import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

app.post("/transaction", async (req, res) => {
  const { id, name } = req.body;
  const params = {
    MessageBody: JSON.stringify({ id: Number(id), name }),
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageGroupId: "YourMessageGroupId",
    MessageDeduplicationId: id.toString(),
  };

  try {
    const sendMessageResult = await sqsClient.send(
      new SendMessageCommand(params)
    );
    res.json({
      message: "Mensagem enviada para a fila SQS com sucesso!",
      MessageId: sendMessageResult.MessageId,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila SQS:", error);
    res.status(500).send("Erro ao enviar a mensagem para a fila SQS");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
