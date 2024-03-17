import axios from "axios";

const url =
  "https://5z50kcp9u4.execute-api.us-east-1.amazonaws.com/default/teste-banco-message";

async function sendTransaction(idempotencyId, amount, type) {
  try {
    const response = await axios.post(url, { idempotencyId, amount, type });
    console.log(`Transação ${idempotencyId} enviada com sucesso.`);
    return response;
  } catch (error) {
    console.error(
      `Erro ao enviar a transação ${idempotencyId}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function sendTransactions() {
  for (let i = 1; i <= 100; i++) {
    await sendTransaction(i, `Valor ${i}`, "debit");
  }
  console.log("Script concluído.");
}

sendTransactions().catch((e) => {
  console.error("Um erro ocorreu durante o envio das transações", e);
});
