import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/Header.module.css";
import logo from "../assets/sprayerLogo.svg";
import charLogo from "../assets/charLogo.png";
import newLogo from "../assets/logo.png";
import squLogo from "../assets/squLogo.png";
import logoLong from "../assets/logoLong-resized.png";

const Header = () => {
  const { data: session } = useSession();

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
        {/* sign out */}

        {session ? (
          <>
            {/* <p> Signed in as {session.user.email} </p> */}
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <button onClick={() => signIn("google")}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default Header;
