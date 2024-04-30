import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import optGenerator from "otp-generator";

dotenv.config();

export async function register(req, res) {
  const { username, email, password, firstName, lastName, mobile, address } =
    req.body;
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(201).send({ message: " User already existed" });
    }
    const saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);

    const newUser = new userModel({
      email,
      password: hashPassword,
      username,
      firstName,
      lastName,
      mobile,
      address,
    });

    await newUser.save();
    return res.status(201).send({ success: true, message: "record registred" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Erreur interne",
      error: error.message,
    });
  }
}

export async function updateUser(req, res) {
  const id = req.user;
  const body = req.body;
  if (!req.body) {
    return res.status(400).send({ error: "Le corps de la requête est vide" });
  }

  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      {
        new: true,
      }
    );

    if (updatedUser) {
      return res.status(200).send(updatedUser);
    } else {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    // Gérez les erreurs de manière appropriée
    return res.status(500).send({
      message: "Erreur interne du serveur",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!user) {
      return res.status(400).send({ message: " user is not registered !" });
    }
    if (!validPassword) {
      return res.status(400).send({ message: "password is incorrect !" });
    }
    const token = jwt.sign(
      { username: user.username, userId: user._id },
      process.env.KEY,
      {
        expiresIn: "24h",
      }
    );
    res.cookie("token", token, { httpOnly: true, maxAge: 36000 });
    return res.status(201).send({
      status: true,
      message: "Login successfully",
      username: user.username,
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erreur interne",
      error: error.message,
    });
  }
}

export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return re.status(501).send({ error: "Invalid username" });

    const user = await userModel.findOne({ username }).select("-password");
    if (!user)
      return res.status(501).send({ error: "Cannot Find User ", username });
    else {
      return res.status(201).send(user);
    }
  } catch (error) {
    return res.status(404).send({ error: "Cann't find the User Data" });
  }
}
export async function generateOTP(req, res) {
  req.app.locals.OTP = optGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOTP(req, res) {
  const { code } = req.query;
  try {
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      // reset the OTP value
      req.app.locals.OTP = null;
      // start session for reset password
      req.app.locals.resetSession = true;
      return res.status(201).send({ msg: "Verify Successfully" });
    }
    // return res.status(400).send({ msg: " Invalid OTP" });
  } catch (error) {
    return res
      .status(400)
      .send({ error: error.message, success: false, message: "Invalid OTP" });
  }
}

export async function createResetSession(req, res) {
  // allow access to this route only one
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }

  return res.status(440).send({ error: "Session expired !" });
}

export async function verifyUser(req, res, next) {
  let username;
  if (req.method === "GET") {
    username = req.query.username;
  } else {
    username = req.body.username;
  }

  try {
    let user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Can't find User !", username });
    }
    next();
  } catch (error) {
    return res
      .status(404)
      .send({ error: error.message, message: "Authentification error" });
  }
}

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;

    try {
      const user = await userModel.findOne({ username });

      if (!user) {
        return res.status(404).send({ error: "Username not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.updateOne(
        { username: user.username },
        { password: hashedPassword }
      );

      req.app.locals.resetSession = false; // Réinitialisation de la session

      return res.status(201).send({ msg: "Record Updated...!" });
    } catch (error) {
      return res.status(500).send({ error: "Unable to hash password" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
