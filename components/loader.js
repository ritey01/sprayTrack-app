import styles from "../styles/Loader.module.css";
import { HashLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <HashLoader className={styles.spinner} color="#06D6A0" size={80} />
    </div>
  );
};

export default Loader;
