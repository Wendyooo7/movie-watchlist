import styles from "../styles/signMain.module.scss";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignInModal() {
  const router = useRouter();
  const [signInEmail, setSignInEmail] = useState("test@gmail.com");
  const [signInPassword, setSignInPassword] = useState("test1234");
  const [signInEmailError, setSignInEmailError] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState("");
  const [signInFeedbackMessage, setSignInFeedbackMessage] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign-In Email validation
  const handleSignInEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignInEmail(value);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setSignInEmailError("請輸入有效的電子信箱");
    } else {
      setSignInEmailError("");
    }
  };

  // Sign-In Password validation
  const handleSignInPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSignInPassword(value);

    const isValid =
      /[a-zA-Z]/.test(value) && /[0-9]/.test(value) && value.length >= 8;

    if (!isValid) {
      setSignInPasswordError("密碼須為 8 位英數組合");
    } else {
      setSignInPasswordError("");
    }
  };

  // Handle authentication errors from Firebase
  const handleAuthErrors = (error: any) => {
    console.error("error.code: ", error.code);
    switch (error.code) {
      case "auth/invalid-email":
        setSignInFeedbackMessage("無效的信箱格式，請重新確認");
        break;
      case "auth/wrong-password":
        setSignInFeedbackMessage("密碼錯誤");
        break;
      default:
        setSignInFeedbackMessage("請確認所有欄位填寫正確");
    }
  };

  // Handle Sign-In form submission
  const handleSignInSubmit = async () => {
    if (
      !signInEmail ||
      !signInPassword ||
      signInEmailError ||
      signInPasswordError
    ) {
      setSignInFeedbackMessage("請確認所有欄位填寫正確");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      setSignInFeedbackMessage("登入成功！");

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error: any) {
      handleAuthErrors(error);
    }
  };

  return (
    <div>
      <h2>登入系統</h2>
      <input
        className={styles.authForm__nonPassword__input}
        type="email"
        placeholder="輸入電子信箱"
        value={signInEmail}
        onChange={handleSignInEmailChange}
        required
      />
      {signInEmailError && (
        <p className={styles.authForm__instant__errMsg}>{signInEmailError}</p>
      )}

      <div className={styles.authForm__passwordContainer}>
        <input
          className={styles.authForm__passwordContainer__input}
          type={showSignInPassword ? "text" : "password"}
          placeholder="輸入密碼（8 位英數組合）"
          value={signInPassword}
          onChange={handleSignInPasswordChange}
          required
        />
        <div
          onClick={() => setShowSignInPassword(!showSignInPassword)}
          className={styles.authForm__passwordContainer__visibility}
        >
          {showSignInPassword ? (
            <Image
              src="/sign/visibility-off-24dp-8440F1.svg"
              width={18}
              height={18}
              alt="隱藏密碼"
            ></Image>
          ) : (
            <Image
              src="/sign/visibility-24dp-8440F1.svg"
              width={18}
              height={18}
              alt="查看密碼"
            ></Image>
          )}
        </div>
      </div>
      {signInPasswordError && (
        <p className={styles.authForm__instant__errMsg}>
          {signInPasswordError}
        </p>
      )}

      <button onClick={handleSignInSubmit}>登入</button>
      {signInFeedbackMessage && (
        <p
          className={
            signInFeedbackMessage === "登入成功！"
              ? styles.authForm__afterSend__successMsg
              : styles.authForm__afterSend__errMsg
          }
        >
          {signInFeedbackMessage}
        </p>
      )}
    </div>
  );
}
