import styles from "../styles/Header.module.css";
import logo from "../assets/sprayerLogo.svg";
import Image from "next/image";

const Header = () => {
  return (
    <div className={styles.headerLayout}>
      <Image
        alt="SprayTruck Logo"
        src={logo}
        className={styles.logo}
        width={150}
        height={150}
      />
      <h1 className={styles.title}>sprayTrack</h1>
    </div>
  );
};

export default Header;
