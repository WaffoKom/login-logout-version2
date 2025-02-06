import { useState, useEffect } from "react";
import styles from "../styles/Username.module.css";
import { useAuthStore } from "../store/store.jsx";
import toast, { Toaster } from "react-hot-toast";
import { generateOTP, verifyOTP } from "../helper/helper.jsx";
import { useNavigate } from "react-router-dom";

export default function Recovery() {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOTP = async () => {
      try {
        const OTP = await generateOTP(username);
        console.log(OTP);
        if (OTP) {
          toast.success("OTP has been sent to your email ...!");
        } else {
          toast.error("Problem while generating OTP ....!");
        }
      } catch (error) {
        console.error("Error generating OTP:", error);
        toast.error("An error occurred while generating OTP.");
      }
    };

    if (username) {
      fetchOTP();
    }
  }, [username]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success("Verify Successfully ...!");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("Wrong OTP! Check email again!");
    }
  }
  async function resendOTP() {
    let sendPromise = await generateOTP(username);

    try {
      const OTP = await sendPromise;
      if (!OTP) {
        toast.loading("Sending ...!");
      }
      console.log(OTP);
      toast.success("OTP has been sent to your email ...!");
    } catch (error) {
      console.error(error);
      toast.error("Could not send it ....!");
    }
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center ">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery now</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password
            </span>
          </div>
          <form className="pt-20" onSubmit={handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digits OTP sent your email address
                </span>
                <input
                  type="text"
                  className={styles.textbox}
                  placeholder="OTP"
                  onChange={(e) => setOTP(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.btn}>
                Recover
              </button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className="text-gray-500">
              Can&apos;t get OTP ?
              <button onClick={resendOTP} className="text-red-500" to="/resend">
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
