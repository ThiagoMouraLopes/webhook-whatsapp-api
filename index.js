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
    const funilDeVendasIntegrationKey = "ebe1fc26-45ce-49e9-9282-97769f655353";

    const receiverPhoneNumber =
      req.body.entry[0].changes[0].value.metadata.display_phone_number;
    const contactName =
      req.body.entry[0].changes[0].value.contacts[0].profile.name;
    const contactPhoneNumber = String(
      req.body.entry[0].changes[0].value.contacts[0].wa_id
    );

    // const facebookAccessToken =
    //   "EAAMa1MvEg6wBO15SEjjDMegWRQAhZAbAnoYZADBsqscZC4gy7jJFc1gXsx3tQssn4MyUJOt6cdyZCbc0cduCS8t4UQU4JTM1C7twgZAuvRYRkeuUzhhO13QOTzTf3sS3I1870kZATHahpEYuIpbVxSw6yxAhYmjQUPVvy6B5SpR4ZB61cQ6V6NQkiwkhRGAaeMZAj9eALhihT5an";

    // const findContact = await axios
    //   .get(
    //     `https://graph.facebook.com/v18.0/${contactWhatsappId}?fields=id,name,phone_numbers`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${facebookAccessToken}`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log("contact", JSON.stringify(res.data));
    //     return res.data;
    //   })
    //   .catch((err) => {
    //     console.log("contact not fonud", err.response.data);
    //     throw err;
    //   });
    // const contactPhoneNumber = findContact.display_phone_number.replace(
    //   /\D/g,
    //   ""
    // );

    const sellerId = receiverPhoneNumber ? 60206 : 60206;

    const oportunidade = {
      titulo: "Lead",
      valor: 0,
      codigo_vendedor: sellerId,
      codigo_metodologia: 20897,
      codigo_etapa: 93269,
      codigo_canal_venda: 104961,
      empresa: {
        nome: "",
        cnpj: "",
        segmento: "",
      },
      contato: {
        nome: contactName,
        email: "",
        telefone1: contactPhoneNumber,
      },
    };

    // Faça uma requisição para a API do CRM para criar a oportunidade
    try {
      const response = await axios.post(
        `https://app.funildevendas.com.br/api/Opportunity?IntegrationKey=${funilDeVendasIntegrationKey}`,
        { oportunidades: [oportunidade] }
      );
      console.log("sucess", response.data);
    } catch (error) {
      console.log("deu erro!");
      throw error;
    }

    res.json({ Sucess: true });
  } catch (error) {
    console.error(error?.response?.data || error?.response || error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
