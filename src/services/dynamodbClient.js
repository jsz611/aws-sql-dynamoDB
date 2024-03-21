import { config } from "dotenv";
config();

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
const tableName = "TB-DynamoDB-desafio-aws-app-dev";

async function fetchAllTransactions() {
  const params = { TableName: tableName };
  try {
    const data = await docClient.send(new ScanCommand(params));
    return data.Items;
  } catch (err) {
    console.error("Erro ao buscar transações:", err);
    throw new Error("Failed to fetch transactions");
  }
}

export { docClient, tableName, fetchAllTransactions };
