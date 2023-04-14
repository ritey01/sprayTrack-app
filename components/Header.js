import styles from "../styles/Header.module.css";
import logo from "../assets/sprayerLogo.svg";
import charLogo from "../assets/charLogo.png";
import newLogo from "../assets/logo.png";
import squLogo from "../assets/squLogo.png";
import logoLong from "../assets/logoLong.png";
import Image from "next/image";

const Header = () => {
  return (
    <div className={styles.headerLayout}>
      <Image
        alt="SprayTruck Logo"
        src={logoLong}
        className={styles.logo}
        width={100}
        height={100}
      />
      {/* <h1 className={styles.title}>sprayTrack</h1> */}
    </div>
  );
};

export default Header;
