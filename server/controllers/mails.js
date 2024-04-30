import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

dotenv.config();

let Mailgenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.json({ message: " user is not registered !" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.KEY, {
        expiresIn: "15m",
      });
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USERNAME_GOOGLE,
          pass: process.env.PASSWORD_GOOGLE,
        },
      });
      let email = {
        body: {
          name: username,
          intro: text || "Progamme de test",
          outro: "Ce fut un plaisir",
        },
      };

      let emailBody = Mailgenerator.generate(email);

      let mailOptions = {
        from: process.env.EMAIL_GOOGLE,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody,
        text: `${token}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);

          return res.status(400).send({
            messge: "error sending message",
            error: error.message,
          });
        } else {
          console.log("Email send : " + info.response);
          return res.status(200).send({ success: true, message: "email send" });
        }
      });
    }
  } catch (error) {
    console.error({ error: error.message });
  }
};
