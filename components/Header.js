import styles from "../styles/Header.module.css";
import logo from "../assets/wrightcoLogo.png";
import Image from "next/image";

const Header = () => {
  return (
    <div className={styles.headerLayout}>
      <Image
        alt="WrightCo logo"
        src={logo}
        placeholder="blur"
        className={styles.logo}
        width={150}
        height={150}
      />
    </div>
  );
};

export default Header;
