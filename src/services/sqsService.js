import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

export async function sendMessage({ idempotencyId, amount, type }) {
  // Garantindo que idempotencyId seja uma string válida
  const deduplicationId = `${idempotencyId}`; // Convertendo para string

  // Verificando se deduplicationId atende aos requisitos
  if (!deduplicationId.match(/^[a-zA-Z0-9!-*. '_()]*$/) || deduplicationId.length > 128) {
    throw new Error("MessageDeduplicationId é inválido.");
  }

  const params = {
    MessageBody: JSON.stringify({ idempotencyId, amount, type }),
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageGroupId: "YourMessageGroupId",
    MessageDeduplicationId: deduplicationId,
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    return data;
  } catch (error) {
    throw new Error("Erro ao enviar mensagem para SQS: " + error.message);
  }
}
