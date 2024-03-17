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
  const { id, name } = req.body;
  const params = {
    MessageBody: JSON.stringify({ id: Number(id), name }),
    QueueUrl: queueUrl,
    MessageGroupId: "YourMessageGroupId",
    MessageDeduplicationId: id.toString(),
  };

  try {
    const sendMessageResult = await sqs.sendMessage(params).promise();
    res.json({
      message: "Mensagem enviada para a fila SQS com sucesso!",
      MessageId: sendMessageResult.MessageId,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem para a fila SQS:", error);
    res.status(500).send("Erro ao enviar a mensagem para a fila SQS");
  }
});

// Configuração para execução local
const port = 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});

// Configuração para execução como função Lambda
export const handler = serverless(app);
