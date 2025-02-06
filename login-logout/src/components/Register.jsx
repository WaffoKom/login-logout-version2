// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helper/validate.jsx";
import { registerUser } from "../helper/helper.jsx";

export default function Register() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let registerPromise = registerUser(values);
      console.log(values);

      toast.promise(registerPromise, {
        loading: "Creating ...!",
        success: <b>Register Succesfully...!</b>,
        error: <b>Could not Register....!</b>,
      });
      registerPromise.then(() => navigate("/"));
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you !
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} alt="avatar" className={styles.profile_img} />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                type="password"
                className={styles.textbox}
                placeholder="Password"
                {...formik.getFieldProps("password")}
              />
              <input
                type="email"
                className={styles.textbox}
                placeholder="Email"
                {...formik.getFieldProps("email")}
              />
              <input
                type="text"
                className={styles.textbox}
                placeholder="Username"
                {...formik.getFieldProps("username")}
              />
              <button type="submit" className={styles.btn}>
                Register
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Register ?
                <Link className="text-red-500" to="/">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
