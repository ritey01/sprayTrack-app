import styles from "../styles/Header.module.css";
import logo from "../assets/sprayerLogo.svg";
import charLogo from "../assets/charLogo.png";
import newLogo from "../assets/logo.png";
import squLogo from "../assets/squLogo.png";
import logoLong from "../assets/logoLong-resized.png";
import Image from "next/image";

const Header = () => {
  return (
    <div className={styles.headerLayout}>
      <Image
        alt="SprayTruck Logo"
        src={logoLong}
        className={styles.logo}
        width={80}
        height={80}
      />
    </div>
  );
};

export default Header;
