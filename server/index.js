import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.post('/api/send-receipt', async (req, res) => {
  const {
    toEmail,
    driverName,
    driverPiva,
    driverFiscalCode,
    vehicle,
    route,
    price,
  } = req.body || {};

  if (
    !toEmail ||
    !driverName ||
    !driverPiva ||
    !driverFiscalCode ||
    !vehicle ||
    !route ||
    typeof price !== 'number'
  ) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  const subject = 'Ricevuta di Presa Prenotazione';
  const text =
    `Ricevuta di presa prenotazione\n` +
    `Nome Autista: ${driverName}\n` +
    `P.IVA Autista: ${driverPiva}\n` +
    `Codice Fiscale Autista: ${driverFiscalCode}\n` +
    `Veicolo: ${vehicle}\n` +
    `Tratta: ${route}\n` +
    `Costo: €${price}\n`;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'lombardia.ncc.class@gmail.com',
      to: toEmail,
      subject,
      text,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Email send failed' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
});
