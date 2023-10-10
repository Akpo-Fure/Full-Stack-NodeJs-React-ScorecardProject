import { useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import styles from "./login.module.css";
import scoreboard from "./scoreboard.png";
import { apiUrl } from "../../config/config";

const validationSchema = Yup.object().shape({
  Email: Yup.string().email().required("Email is required").trim(),
  Password: Yup.string().required("Password is required").trim(),
});
const isDisabledShcema = Yup.object().shape({
  Email: Yup.string().required(),
  Password: Yup.string().required(),
});

function App() {
  interface IError {
    response: {
      data: {
        message: string;
      };
    };
  }
  interface IFormData {
    Email: string;
    Password: string;
  }
  const initialFormData = {
    Email: "",
    Password: "",
  };

  const [formData, setFormData] = useState<IFormData>(initialFormData);

  const login = async (formData: IFormData) => {
    const response = await axios.post(`${apiUrl}/users/login`, formData);
    return response.data;
  };

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (data) => {
      document.cookie = `token=${data.token}; path=/`;
      toast.dismiss();
      toast.success(data.message);
    },
    onError: (error: IError) => {
      toast.dismiss();
      toast.error(error.response.data.message);
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      mutate(formData);
    } catch (error: any) {
      toast.dismiss();
      toast.error(Object.values(error.errors).join("\n"));
    }
  };

  const isSubmitDisabled = () => {
    try {
      isDisabledShcema.validateSync(formData, { abortEarly: false });
      return false;
    } catch (error: any) {
      return true;
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftside}>
          <div className={styles.scoreboard}>
            <svg
              className={styles.scoreboardlogo}
              width="12"
              height="10"
              viewBox="0 0 28 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Icon Logo" clip-path="url(#clip0_5301_1639)">
                <path
                  id="Vector"
                  d="M7.8 4.39955C7.22765 4.38293 6.68432 4.14388 6.28535 3.73315C5.8864 3.32243 5.66319 2.77238 5.66319 2.19979C5.66319 1.62718 5.8864 1.07712 6.28535 0.666391C6.68432 0.255665 7.22765 0.016632 7.8 0H21.801C22.3734 0.016632 22.9168 0.255665 23.3157 0.666391C23.7146 1.07712 23.9378 1.62718 23.9378 2.19979C23.9378 2.77238 23.7146 3.32243 23.3157 3.73315C22.9168 4.14388 22.3734 4.38293 21.801 4.39955H7.8ZM2.20073 8.22341C2.63599 8.22341 3.06148 8.09434 3.42338 7.85252C3.78528 7.6107 4.06737 7.267 4.23393 6.86487C4.4005 6.46275 4.44407 6.02026 4.35916 5.59338C4.27425 5.16648 4.06464 4.77434 3.75685 4.46658C3.44909 4.15879 3.05695 3.9492 2.63007 3.86427C2.20317 3.77936 1.76066 3.82293 1.35854 3.9895C0.956406 4.15606 0.612703 4.43814 0.370884 4.80005C0.129067 5.16197 0 5.58744 0 6.0227C0.00147519 6.60539 0.234 7.16374 0.646555 7.57525C1.05911 7.98675 1.61803 8.21786 2.20073 8.21786V8.22341ZM4.20088 15.9993C3.61721 15.9993 3.05741 16.2311 2.6447 16.6438C2.23199 17.0566 2.00014 17.6163 2.00014 18.2C2.00014 18.7837 2.23199 19.3434 2.6447 19.7561C3.05741 20.1688 3.61721 20.4007 4.20088 20.4007H18.2C18.7837 20.4007 19.3434 20.1688 19.7561 19.7561C20.1689 19.3434 20.4007 18.7837 20.4007 18.2C20.4007 17.6163 20.1689 17.0566 19.7561 16.6438C19.3434 16.2311 18.7837 15.9993 18.2 15.9993H4.20088ZM7.40073 8.00057C7.10647 7.99201 6.81349 8.04258 6.53913 8.14927C6.26477 8.25598 6.0146 8.41666 5.80344 8.62177C5.59227 8.82689 5.4244 9.07229 5.30978 9.34343C5.19513 9.61458 5.13608 9.90596 5.13608 10.2003C5.13608 10.4947 5.19513 10.7861 5.30978 11.0573C5.4244 11.3284 5.59227 11.5738 5.80344 11.7789C6.0146 11.984 6.26477 12.1447 6.53913 12.2514C6.81349 12.3581 7.10647 12.4087 7.40073 12.4001H18.5993C18.8936 12.4087 19.1865 12.3581 19.461 12.2514C19.7353 12.1447 19.9855 11.984 20.1966 11.7789C20.4078 11.5738 20.5757 11.3284 20.6902 11.0573C20.8048 10.7861 20.8639 10.4947 20.8639 10.2003C20.8639 9.90596 20.8048 9.61458 20.6902 9.34343C20.5757 9.07229 20.4078 8.82689 20.1966 8.62177C19.9855 8.41666 19.7353 8.25598 19.461 8.14927C19.1865 8.04258 18.8936 7.99201 18.5993 8.00057H7.40073ZM23.8011 12.1773C23.3658 12.1769 22.94 12.3057 22.5778 12.5474C22.2155 12.7891 21.9332 13.1327 21.7665 13.535C21.5997 13.9372 21.5559 14.3798 21.6407 14.8069C21.7256 15.2339 21.9353 15.6262 22.2432 15.9341C22.5511 16.242 22.9433 16.4516 23.3705 16.5365C23.7974 16.6214 24.2402 16.5776 24.6422 16.4108C25.0445 16.244 25.3883 15.9617 25.6299 15.5995C25.8715 15.2373 26.0004 14.8116 26 14.3761C26.0007 14.0869 25.9445 13.8004 25.8342 13.533C25.724 13.2655 25.5623 13.0225 25.358 12.8177C25.1537 12.6129 24.911 12.4505 24.6439 12.3396C24.3769 12.2288 24.0905 12.1717 23.8011 12.1717V12.1773Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_5301_1639">
                  <rect width="26" height="20.4286" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <h3 className={styles.scoreboardname}>Scorecard</h3>
          </div>
          <h2 className={styles.header}>Login to your account</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.details}>Email Address</p>
            <input
              className={styles.forminput}
              onChange={handleInputChange}
              name="Email"
              value={formData.Email}
              type="email"
              placeholder="Enter email address"
              required
            />
            <p className={styles.details}>Password</p>
            <input
              className={styles.forminput}
              onChange={handleInputChange}
              name="Password"
              value={formData.Password}
              type="password"
              placeholder="Enter password"
              required
            />
            <Link className={styles.link3} to="/users/forgotpassword">
              Forgot Password?
            </Link>
            <button
              type="submit"
              onSubmit={handleSubmit}
              disabled={isSubmitDisabled() || isLoading}
              className={styles.signupbtn}
            >
              {isLoading ? (
                <p className={styles.signup2}> Logging in...</p>
              ) : (
                <p className={styles.signup}>Log In</p>
              )}
            </button>
            <p className={styles.link}>
              Dont't have an account?{" "}
              <Link className={styles.link2} to="/users/signup">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
        <img className={styles.rightside} src={scoreboard} alt="" />
      </div>
    </>
  );
}

export default App;
