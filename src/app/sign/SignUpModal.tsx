import styles from "../styles/signMain.module.scss";
import Image from "next/image";
import React, { useState } from "react";
import { auth } from "@/app/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";

export default function SignUpModal({
  setIsSigningUp,
}: {
  setIsSigningUp: Dispatch<SetStateAction<boolean>>;
}) {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [name, setName] = useState("");
  const [signUpEmailError, setSignUpEmailError] = useState("");
  const [signUpPasswordError, setSignUpPasswordError] = useState("");
  const [signUpFeedbackMessage, setSignUpFeedbackMessage] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Sign-Up Email validation
  const handleSignUpEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignUpEmail(value);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setSignUpEmailError("請輸入有效的電子信箱");
    } else {
      setSignUpEmailError("");
    }
  };

  // Sign-Up Password validation
  const handleSignUpPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSignUpPassword(value);

    const isValid =
      /[a-zA-Z]/.test(value) && /[0-9]/.test(value) && value.length >= 8;

    if (!isValid) {
      setSignUpPasswordError("密碼須為 8 位英數組合");
    } else {
      setSignUpPasswordError("");
    }
  };

  // Handle authentication errors from Firebase
  const handleAuthErrors = (error: any) => {
    console.error("error.code: ", error.code);
    switch (error.code) {
      case "auth/email-already-in-use":
        setSignUpFeedbackMessage(
          "此信箱已被使用，請改用其他信箱註冊，或直接登入"
        );
        break;
    }
  };

  // Handle Sign-Up form submission
  const handleSignUpSubmit = async () => {
    if (
      !signUpPassword ||
      !signUpEmail ||
      signUpEmailError ||
      signUpPasswordError ||
      !name
    ) {
      setSignUpFeedbackMessage("請確認所有欄位填寫正確");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      setSignUpFeedbackMessage("註冊成功！");

      setTimeout(() => setIsSigningUp(false), 2000); // Switch to sign-in after 2 seconds
    } catch (error: any) {
      handleAuthErrors(error);
    }
  };

  return (
    <div>
      <h2>註冊帳號</h2>
      <input
        className={styles.authForm__nonPassword__input}
        type="text"
        placeholder="輸入姓名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className={styles.authForm__nonPassword__input}
        type="email"
        placeholder="輸入常用信箱"
        value={signUpEmail}
        onChange={handleSignUpEmailChange}
        required
      />
      {signUpEmailError && (
        <p className={styles.authForm__instant__errMsg}>{signUpEmailError}</p>
      )}

      <div className={styles.authForm__passwordContainer}>
        <input
          className={styles.authForm__passwordContainer__input}
          type={showSignUpPassword ? "text" : "password"}
          placeholder="輸入 8 位英數組合"
          value={signUpPassword}
          onChange={handleSignUpPasswordChange}
          required
        />
        <div
          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
          className={styles.authForm__passwordContainer__visibility}
        >
          {showSignUpPassword ? (
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
      {signUpPasswordError && (
        <p className={styles.authForm__instant__errMsg}>
          {signUpPasswordError}
        </p>
      )}

      <button onClick={handleSignUpSubmit}>註冊</button>
      {signUpFeedbackMessage && (
        <p
          className={
            signUpFeedbackMessage === "註冊成功！"
              ? styles.authForm__afterSend__successMsg
              : styles.authForm__afterSend__errMsg
          }
        >
          {signUpFeedbackMessage}
        </p>
      )}
    </div>
  );
}
