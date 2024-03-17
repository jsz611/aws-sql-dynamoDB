import axios from 'axios';

const url = 'https://5z50kcp9u4.execute-api.us-east-1.amazonaws.com/default/teste-banco-message';

async function sendTransaction(id, name) {
  try {
    const response = await axios.post(url, { id, name });
    console.log(`Transação ${id} enviada com sucesso.`);
    return response;
  } catch (error) {
    console.error(`Erro ao enviar a transação ${id}:`, error.response ? error.response.data : error.message);
  }
}

async function sendTransactions() {
  for (let i = 1; i <= 100; i++) {
    await sendTransaction(i, `Transação ${i}`);
  }
  console.log('Script concluído.');
}

sendTransactions();
