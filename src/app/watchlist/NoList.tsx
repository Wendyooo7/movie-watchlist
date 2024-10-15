import styles from "@/app/styles/watchlistMain.module.scss";

export default function NoList() {
  return (
    <div className={styles.noList__flexContainer}>
      <div className={styles.noList__flexItem}>
        <div className={styles.noList__text}>這裡空無一物(๑•́ ₃ •̀๑)</div>
        <div className={styles.noList__text}>
          把想看的電影加進片單再回來吧！
        </div>
      </div>
    </div>
  );
}
