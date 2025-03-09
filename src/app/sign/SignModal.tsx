"use client";

import React, { useState } from "react";
import styles from "../styles/signMain.module.scss";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

export default function SignModal() {
  const [isSigningUp, setIsSigningUp] = useState(false);

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
            <SignInModal />
          ) : (
            <SignUpModal setIsSigningUp={setIsSigningUp} />
          )}
        </div>
      </div>
    </main>
  );
}
