import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
const port = process.env.port || 9002;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(logger("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.post("/api/v1/mail/send", (req, res) => {
  const {
    mailAuthentication,
    mailFrom,
    mailTo,
    subject,
    text,
    html,
    sentFrom,
  } = req.body;

  if (!mailFrom || !mailTo || !subject || !text || !html || !sentFrom);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: mailAuthentication?.email,
      pass: mailAuthentication?.pass,
    },
  });

  const mailOptions = {
    from: `${sentFrom} <${mailFrom}>`,
    to: mailTo,
    subject,
    text,
    html: html + "<br/><p>Thanks for using this service by CoderX_001</p>",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log("An error occurred: ", err);
    }

    console.log("Email sent successfully: ", info.response);
  });

  return res
    .status(200)
    .json({ status: "success", message: "Email sent successfully" });
});

app.listen(port, () => console.log(`Server running on port ${port}...`));
