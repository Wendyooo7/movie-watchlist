import Image from "next/image";
import styles from "./styles/indexMain.module.scss";

export default function Main() {
  return (
    <main className={styles.main}>
      <h1>你想將哪部電影加入片單呢？</h1>
      <div className={styles.searchArea}>
        <input type="text" className={styles.input} />
        <div className={styles.imgWrapper}>
          <Image
            src="/search.png"
            width={30}
            height={30}
            alt="點擊以檢索片名"
          />
        </div>
      </div>
    </main>
  );
}
