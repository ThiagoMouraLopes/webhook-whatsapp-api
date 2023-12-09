const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/webhooks", async (req, res) => {
  console.log("receive webhook");
  console.log({ queries: req.query });
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == "123"
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
});

app.post("/webhooks", async (req, res) => {
  try {
    // Verifica se a chave de integração está presente no cabeçalho
    const integrationKey = "ebe1fc26-45ce-49e9-9282-97769f655353";

    // Processa a mensagem do WhatsAppps
    const whatsappMessage = req.body.message; // Adapte conforme a estrutura real da mensagem
    const data = {};

    const phoneNumber =
      req.body.entry[0].changes[0].value.metadata.display_phone_number;
    const name = req.body.entry[0].changes[0].value.contacts[0].profile.name;

    // Crie a oportunidade no CRM com base nas informações da mensagem
    const oportunidade = {
      // Adaptar com as informações da mensagem do WhatsApp
      titulo: "Oportunidades",
      valor: 100,
      codigo_vendedor: 60206,
      codigo_metodologia: 20897,
      codigo_etapa: 93269,
      codigo_canal_venda: 104961,
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

    console.log("oportunidade", oportunidade);

    // Faça uma requisição para a API do CRM para criar a oportunidade
    try {
      const response = await axios.post(
        `https://app.funildevendas.com.br/api/Opportunity?IntegrationKey=ebe1fc26-45ce-49e9-9282-97769f655353`,
        { oportunidades: [oportunidade] }
      );
      console.log("sucess", response.data);
    } catch {
      console.log("deu erro!");
    }

    res.json({ Sucess: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
