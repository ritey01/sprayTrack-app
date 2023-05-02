import styles from "../styles/Header.module.css";
import logo from "../assets/sprayerLogo.svg";
import charLogo from "../assets/charLogo.png";
import newLogo from "../assets/logo.png";
import squLogo from "../assets/squLogo.png";
import logoLong from "../assets/logoLong-resized.png";
import Image from "next/image";
import Link from "next/link";

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
      {/* Link to dashboard */}
      <div className={styles.headerLinks}>
        <Link href={"/dashboard"} className={styles.dashLink}>
          Dashboard
        </Link>
        {/* link to paddock */}
        <Link href={"/paddock"} className={styles.paddockLink}>
          Start record
        </Link>
      </div>
    </div>
  );
};

export default Header;
