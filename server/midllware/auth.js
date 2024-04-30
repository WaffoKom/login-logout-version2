import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);

    const decodedToken = jwt.verify(token, process.env.KEY);
    console.log(decodedToken);
    req.user = decodedToken;
    res.json(decodedToken);
    next();
  } catch (error) {
    res
      .status(401)
      .send({ message: "Authentification Failed", error: error.message });
  }
}

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
