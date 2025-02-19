const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/webhook", async (req, res) => {
  const requestBody = req.body;

  console.log("Headers enviados pelo bradesco: ", req.headers);

  if (!requestBody.url || !requestBody.timestamp) {
    return res
      .status(400)
      .json({ message: "URL e Timestamp são obrigatórios" });
  }

  console.log("URL recebida:", requestBody.url);
  console.log("Timestamp recebido:", requestBody.timestamp);

  try {
    const response = await axios.post(
      "https://gateway-apimqaaz.cpfl.com.br/qa/bff/pagamentos/confirmar/pagamento",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "938fa9ef5a014d0b99f57eb8d760c3f5",
          "api-version": "1.0.0",
        },
      }
    );

    console.log("Resposta do serviço de pagamento:", response.data);

    res.status(200).json({
      message: "Recebido com sucesso e enviado para o serviço de pagamento",
      status: "processando",
    });
  } catch (error) {
    console.error(
      "Erro ao repassar para o serviço de pagamento:",
      error.message
    );
    res.status(500).json({
      message: "Erro ao repassar a requisição para o serviço de pagamento",
    });
  }

  setTimeout(() => {
    console.log(`Processamento finalizado para a URL: ${requestBody.url}`);
  }, 3000);
});

app.listen(port, () => {
  console.log(`Webhook rodando em http://localhost:${port}`);
});
