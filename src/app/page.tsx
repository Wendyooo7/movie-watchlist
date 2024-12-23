import styles from "./styles/indexMain.module.scss";
import SearchArea from "@/app/homepage_components/SearchArea";
import IntroArea_1 from "@/app/homepage_components/IntroArea_1";
import IntroArea_2 from "@/app/homepage_components/IntroArea_2";
import IntroArea_3 from "@/app/homepage_components/IntroArea_3";

export default function Main() {
  return (
    <div className={styles.indexMain}>
      <div className={styles.indexMain__flexContainer}>
        <SearchArea />
        <IntroArea_1 />
        <IntroArea_2 />
        <IntroArea_3 />
      </div>
    </div>
  );
}
