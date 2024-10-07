import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
const port = process.env.port || 9002;
const allowedOrigins = ["https://you-vote.vercel.app/"];

// Use CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // Enable cookies for cross-origin requests
  })
);

app.options('*', cors());
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!'); // Generic error response
});


app.listen(port, () => console.log(`Server running on port ${port}...`));
