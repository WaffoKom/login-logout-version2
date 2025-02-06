import { useEffect } from "react";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidation } from "../helper/validate.jsx";
import { resetPassword } from "../helper/helper.jsx";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store.jsx";
import useFetch from "../Hooks/data.fetch.jsx";

export default function Reset() {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, apiData, serverError, status }] =
    useFetch("createResetSession");
  useEffect(() => {
    console.log(apiData);
  });
  const formik = useFormik({
    initialValues: {
      password: "Admin@@123",
      confirm_pwd: "Admin@@123",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
      let resetPromise = resetPassword({ username, password: values.password });
      toast.promise(resetPromise, {
        loading: "Updating ...!",
        success: <b>Reset Successfully ...!</b>,
        error: <b>Could not Reset ....!</b>,
      });
      resetPromise.then(() => navigate("/password"));
    },
  });
  if (isLoading)
    return <h1 className="text-2xl font-bold mx-auto w-[300px]">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  if (status && status !== 201)
    return <Navigate to={"/password"} replace={true}></Navigate>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center ">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new password
            </span>
          </div>
          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                type="text"
                className={styles.textbox}
                placeholder="New password"
                {...formik.getFieldProps("password")}
              />
              <input
                type="text"
                className={styles.textbox}
                placeholder="Repeat password"
                {...formik.getFieldProps("Confirm_pwd")}
              />
              <button type="submit" className={styles.btn}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
