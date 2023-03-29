import styles from "../styles/Standard.module.css";
import Header from "../components/Header";

const Layout = ({ children }) => {
  return (
    <>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
