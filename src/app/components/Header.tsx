import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/">電影排片站</Link>
      <nav>
        <ul>
          <li>
            <a href="/wathclist">我的片單</a>
          </li>
          <li>登入／註冊</li>
        </ul>
      </nav>
    </header>
  );
}
