"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "@/app/firebase/config";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signOut } from "firebase/auth";

export default function Header() {
  const { user, setUser } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSignOut = async () => {
    await signOut(auth); // 登出 Firebase 使用者
    setUser(null); // 清除使用者狀態

    // window.location.reload();
    // 先用上行代替頁面刷新邏輯

    const currentUrl = `${pathname}?${searchParams.toString()}`;
    router.replace(currentUrl);
  };

  const handleProtectedRouteClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!user) {
      e.preventDefault(); // 阻止Link標籤預設導航
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <section>
      <header>
        <Link href="/">影迷的計畫</Link>
        <nav>
          <ul>
            <li>
              <Link href="/watchlist" onClick={handleProtectedRouteClick}>
                我的片單
              </Link>
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

      {showAlert && (
        <div className="alertForUnauthenticatedUser">
          <p>登入後即可使用「我的片單」！</p>
        </div>
      )}
    </section>
  );
}