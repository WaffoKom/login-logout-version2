import axios from "axios";

import { jwtDecode } from "jwt-decode";
const jwt_decode = jwtDecode;

axios.defaults.baseURL = "http://localhost:3000";

// Make API request

// GEt username by token

export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return "Cannot find Token";
  let decode = jwt_decode(token);
  console.log(decode);
  return decode;
}

// authentificate function
export async function authentificate(username) {
  try {
    return await axios.post("/auth/authentificate", { username });
  } catch (error) {
    return { error: "Username doesn't exist ...!" };
  }
}
// get User details
export async function getUser({ username }) {
  try {
    return await axios.get(`/auth/user/${username}`);
  } catch (error) {
    return { message: "Password doesn't Match ....!", error: error.message };
  }
}

// register user function

export async function registerUser(credentials) {
  try {
    const {
      data: { message },
      status,
    } = await axios.post(`/auth/register`, credentials);
    let { username, email } = credentials;
    if (status === 201) {
      await axios.post("/auth/registerMail", {
        username,
        userEmail: email,
        text: message,
      });
    }
    return message;
  } catch (error) {
    throw { error: error.message };
  }
}

// login function
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      return await axios.post("/auth/login", { username, password });
    }
  } catch (error) {
    throw {
      message: "Password doesn't Match ...!",
      error: error.message,
    };
  }
}

// udpate user details
export async function updatedUser(response) {
  try {
    const token = localStorage.getItem("token");
    const data = await axios.put("/auth/updateUser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return {
      message: "Couldn't Update user informations ...!",
      error: error.message,
    };
  }
}

// generate OTP
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/auth/generateOTP", { params: { username } });
    // send mail with otp
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your password Recovery OTP is ${code}. Verify and recover your password`;

      await axios.post("/auth/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery !",
      });
    }
    return code;
  } catch (error) {
    throw { error: error.message };
  }
}

//verify OTP
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/auth/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    throw { error: error.message };
  }
}

export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/auth/resetPassword", {
      username,
      password,
    });

    return { data, status };
  } catch (error) {
    throw { error: error.message };
  }
}
