import toast from "react-hot-toast";
import { authentificate } from "./helper.jsx";

// validate login passoword

function passwordVerify(errors = {}, values) {
  const specialCharacters = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!values.password) {
    errors.password = toast.error("Password required ....!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Not space in  your password....!");
  } else if (values.password.length < 4) {
    errors.password = toast.error(
      "Password must be more than 4 characters .... !"
    );
  } else if (!specialCharacters.test(values.password)) {
    errors.password = toast.error(
      "Password must have special characters ....!"
    );
  }
  return errors;
}
// validate password

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

// validate reset password

export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match ....!");
  }
  return errors;
}

// validate login username

function usernameVerify(errors = {}, values) {
  if (!values.username) {
    errors.username = toast.error("Username required ....!");
  } else if (values.username.includes(" ")) {
    errors.username = toast.error("Invalid Username ....!");
  }
  return errors;
}
// validate usernameverify

export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  if (values.username) {
    // check if username exist or not
    const { status } = await authentificate(values.username);
    if (status !== 200) {
      errors.exist = toast.error("Username doesn't exist ....!");
    }
  }
  return errors;
}

// Validate register form

export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passowordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

// email Verify
function emailVerify(errors = {}, values) {
  const specialEmail = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/;
  if (!values.email) {
    errors.email = toast.error("Email required ....!");
  } else if (values.email.includes(" ")) {
    errors.email = toast.error("Wrong email ....!");
  } else if (!specialEmail.test(values.email)) {
    errors.password = toast.error("Invalid email ....!");
  }
  return errors;
}
// Validate email
export async function emailValidate(values) {
  const errors = emailVerify({}, values);
  return errors;
}

// validate profile page

export async function profileValidation(values) {
  const erros = emailVerify({}, values);
  return erros;
}
