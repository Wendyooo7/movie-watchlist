import type { Metadata } from "next";
import SignModal from "./SignModal";

export const metadata: Metadata = {
  title: "登入 / 註冊 | 影迷的計畫",
  description: "以現有帳號登入《影迷的計畫》網站，或註冊新帳號",
};

export default function SignPage() {
  return <SignModal />;
}

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
