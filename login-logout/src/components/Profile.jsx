// import React from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate.jsx";
import { updatedUser } from "../helper/helper.jsx";
import { useAuthStore } from "../store/store.jsx";
import useFetch from "../Hooks/data.fetch.jsx";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);
  const formik = useFormik({
    initialValues: {
      firstname: apiData?.firstName || "",
      lastname: apiData?.lastName || "",
      address: apiData?.address || "",
      mobile: apiData?.mobile || "",
      email: apiData?.email || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let updatePromise = updatedUser(values);

      toast.promise(updatePromise, {
        loading: "Updating ...",
        success: <b>Update Successfully ...!</b>,
        error: <b>Could not update ....!</b>,
      });
      console.log(values);
    },
  });

  function userLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  if (isLoading)
    return (
      <h1 className="text-2xl font-bold mx-auto w-[300px]">isLoading...</h1>
    );
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center">
        <div className={`${styles.glass}`}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} alt="avatar" className={styles.profile_img} />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4  gap-10">
                <input
                  type="text"
                  className={styles.textbox}
                  placeholder="First name"
                  {...formik.getFieldProps("firstname")}
                />
                <input
                  type="text"
                  className={styles.textbox}
                  placeholder="Last name"
                  {...formik.getFieldProps("lastname")}
                />
              </div>
              <div className="name flex w-3/4  gap-10">
                <input
                  type="tel"
                  className={styles.textbox}
                  placeholder="Mobile No."
                  {...formik.getFieldProps("mobile")}
                />
                <input
                  type="email"
                  className={styles.textbox}
                  placeholder="email"
                  {...formik.getFieldProps("email")}
                />
              </div>
              <input
                type="text"
                className={styles.textbox}
                placeholder="Your address"
                {...formik.getFieldProps("address")}
              />
              <button type="submit" className={styles.btn}>
                Update
              </button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className="text-gray-500">
              come back later
              <button onClick={userLogout} className="text-red-500" to="/">
                Logout
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
