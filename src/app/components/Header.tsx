"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";

export default function Header() {
  const { user, setUser } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth); // 登出 Firebase 使用者
    setUser(null); // 清除使用者狀態
  };

  return (
    <section>
      <header>
        <Link href="/">電影排片站</Link>
        <nav>
          <ul>
            <li>
              <Link href="/watchlist">我的片單</Link>
            </li>
            {user ? (
              <li>
                <div onClick={handleSignOut}>登出</div>
              </li>
            ) : (
              <li>
                <Link href="/sign">登入／註冊</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </section>
  );
}
