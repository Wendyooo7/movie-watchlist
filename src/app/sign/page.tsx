"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "../styles/signMain.module.scss";
import { auth } from "@/app/firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

const AuthModal = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [signInEmail, setSignInEmail] = useState("test@gmail.com");
  const [signInPassword, setSignInPassword] = useState("test1234");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [name, setName] = useState("");

  const [signInEmailError, setSignInEmailError] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState("");
  const [signUpEmailError, setSignUpEmailError] = useState("");
  const [signUpPasswordError, setSignUpPasswordError] = useState("");
  const [signInFeedbackMessage, setSignInFeedbackMessage] = useState("");
  const [signUpFeedbackMessage, setSignUpFeedbackMessage] = useState("");

  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

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
    console.log("error.code", error.code);
    switch (error.code) {
      case "auth/email-already-in-use":
        setSignUpFeedbackMessage(
          "此信箱已被使用，請改用其他信箱註冊，或直接登入。"
        );
        break;
      case "auth/invalid-email":
        setSignInFeedbackMessage("無效的信箱格式，請重新確認。");
        break;
      case "auth/wrong-password":
        setSignInFeedbackMessage("密碼錯誤。");
        break;
      default:
        setSignInFeedbackMessage("請確認帳密填寫正確");
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

  // Handle Sign-Up form submission
  const handleSignUpSubmit = async () => {
    if (
      !signUpPassword ||
      !signUpEmail ||
      signUpEmailError ||
      signUpPasswordError ||
      !name
    ) {
      setSignUpFeedbackMessage("請確認所有欄位已正確填寫");
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
    <main>
      <div className={styles.authContainer}>
        <div className={styles.authTabs}>
          <button
            className={`${styles.authTab} ${!isSigningUp ? styles.active : ""}`}
            onClick={() => setIsSigningUp(false)}
          >
            登入
          </button>
          <button
            className={`${styles.authTab} ${isSigningUp ? styles.active : ""}`}
            onClick={() => setIsSigningUp(true)}
          >
            註冊
          </button>
        </div>

        <div className={styles.authForm}>
          {!isSigningUp ? (
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
                <p className={styles.authForm__instant__errMsg}>
                  {signInEmailError}
                </p>
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
                      src="/sign/visibility_off_24dp_8440F1.svg"
                      width={18}
                      height={18}
                      alt="隱藏密碼"
                    ></Image>
                  ) : (
                    <Image
                      src="/sign/visibility_24dp_8440F1.svg"
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
          ) : (
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
                <p className={styles.authForm__instant__errMsg}>
                  {signUpEmailError}
                </p>
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
                      src="/sign/visibility_off_24dp_8440F1.svg"
                      width={18}
                      height={18}
                      alt="隱藏密碼"
                    ></Image>
                  ) : (
                    <Image
                      src="/sign/visibility_24dp_8440F1.svg"
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
          )}
        </div>
      </div>
    </main>
  );
};

export default AuthModal;

// "use client";
// import React, { useState } from "react";
// import styles from "../styles/loginMain.module.scss";
// import { auth } from "@/app/firebase/config";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";

// const AuthModal = () => {
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");

//   // 處理登入邏輯
//   const handleSignIn = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       console.log("登入成功：", userCredential.user);
//     } catch (err) {
//       console.error("登入失敗");
//     }
//   };

//   // 處理註冊邏輯
//   const handleSignUp = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       console.log("註冊成功：", userCredential.user);
//       // 註冊成功後可以選擇更新用戶資料（如顯示名稱等）
//       if (name) {
//         // 更新用戶名稱或其他資訊
//       }
//       // 這裡可以實現註冊後的導航或其他邏輯
//     } catch (err) {
//       console.error("註冊失敗：");
//     }
//   };

//   return (
//     <main>
//       <div className={styles.authContainer}>
//         <div className={styles.authTabs}>
//           <button
//             className={`${styles.authTab} ${
//               !isRegistering ? styles.active : ""
//             }`}
//             onClick={() => setIsRegistering(false)}
//           >
//             登入
//           </button>
//           <button
//             className={`${styles.authTab} ${
//               isRegistering ? styles.active : ""
//             }`}
//             onClick={() => setIsRegistering(true)}
//           >
//             註冊
//           </button>
//         </div>

//         <div className={styles.authForm}>
//           {!isRegistering ? (
//             <div>
//               <h2>登入系統</h2>
//               <input
//                 type="email"
//                 placeholder="輸入電郵"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="輸入密碼"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button onClick={handleSignIn}>登入</button>
//             </div>
//           ) : (
//             <div>
//               <h2>註冊帳號</h2>
//               <input
//                 type="text"
//                 placeholder="輸入姓名"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="請輸入常用電子信箱"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="請輸入密碼"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button onClick={handleSignUp}>註冊</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// };

// export default AuthModal;
