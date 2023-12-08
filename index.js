const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/whatsapp-webhook", async (req, res) => {
  try {
    // Verifica se a chave de integração está presente no cabeçalho
    const integrationKey = req.headers["integrationkey"];
    if (integrationKey !== "ebe1fc26-45ce-49e9-9282-97769f655353") {
      return res.status(401).json({ error: "Chave de integração inválida." });
    }

    // Processa a mensagem do WhatsApp
    const whatsappMessage = req.body.message; // Adapte conforme a estrutura real da mensagem

    // Crie a oportunidade no CRM com base nas informações da mensagem
    const oportunidade = {
      // Adaptar com as informações da mensagem do WhatsApp
      titulo: "Título da Oportunidade",
      valor: 1000,
      codigo_vendedor: 60206,
      codigo_metodologia: 456,
      codigo_etapa: 789,
      codigo_canal_venda: 20897,
      empresa: {
        nome: "Nome da Empresa",
        cnpj: "12345678901234",
        segmento: "Segmento da Empresa",
        // Adicionar outros campos conforme necessário
      },
      contato: {
        nome: "Nome do Contato",
        email: "contato@email.com",
        telefone1: "123456789",
        // Adicionar outros campos conforme necessário
      },
    };

    // Faça uma requisição para a API do CRM para criar a oportunidade
    const response = await axios.post(
      "https://app.funildevendas.com.br/api/Opportunity?IntegrationKey=",
      { oportunidades: [oportunidade] }
    );

    res.json({
      success: true,
      message: "Oportunidade criada com sucesso no CRM.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
