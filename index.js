const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/whatsapp-webhook", async (req, res) => {
  try {
    if (
      req.query["hub.mode"] == "subscribe" &&
      req.query["hub.verify_token"] == "123"
    ) {
      res.send(req.query["hub.challenge"]);
    } else {
      res.sendStatus(400);
    }

    // Verifica se a chave de integração está presente no cabeçalho
    const integrationKey = req.headers["integrationkey"];

    // Processa a mensagem do WhatsAppps
    const whatsappMessage = req.body.message; // Adapte conforme a estrutura real da mensagem
    const data = {};

    const phoneNumber =
      req.body.entry[0].changes[0].value.metadata.display_phone_number;
    const name = req.body.entry[0].changes[0].value.contacts[0].profile.name;

    // Crie a oportunidade no CRM com base nas informações da mensagem
    const oportunidade = {
      // Adaptar com as informações da mensagem do WhatsApp
      titulo: `${name} - Título da Oportunidade`,
      valor: 1000,
      codigo_vendedor: 60206,
      codigo_metodologia: 456,
      codigo_etapa: 789,
      codigo_canal_venda: 20897,
      empresa: {
        nome: name,
        cnpj: "",
        segmento: "",
      },
      contato: {
        nome: name,
        email: "",
        telefone1: phoneNumber,
        // Adicionar outros campos conforme necessário
      },
    };

    // Faça uma requisição para a API do CRM para criar a oportunidade
    try {
      await axios.post(
        "https://app.funildevendas.com.br/api/Opportunity?IntegrationKey=",
        { oportunidades: [oportunidade] }
      );
    } catch {
      console.log("deu erro!");
    }

    res.send(req.query["hub.challenge"]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
