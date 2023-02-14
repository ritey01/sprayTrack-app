import React, { useContext } from "react";
import standard from "../styles/Standard.module.css";
import styles from "../styles/SprayDetails.module.css";
import Link from "next/link";
import SprayContext from "../context/sprayEvent";

const SprayDetails = () => {
  const { event } = useContext(SprayContext);
  const [sprayEvent, setSprayEvent] = event;
  console.log("🥶", sprayEvent);
  return (
    <div className={`${standard.cardBackground} ${styles.detailsCard}`}>
      <p className={styles.labels}> Date</p>

      <p className={styles.sprayDetails}>
        {/* Checks if date else returns message */}
        {sprayEvent.date ? sprayEvent.date : "No date entered"}
        <Link href={`/date`} className={styles.editBtn}>
          Edit
        </Link>
      </p>

      <p className={styles.labels}> Paddock</p>
      <p className={styles.sprayDetails}>
        {/* Checks if a paddock entered else returns a message */}
        {sprayEvent.paddock ? sprayEvent.paddock : "No paddock entered"}
        <Link href={`/paddock`} className={styles.editBtn}>
          Edit
        </Link>
      </p>

      <p className={styles.labels}> Crop</p>
      <p className={styles.sprayDetails}>
        {/* Checks if a crop entered else returns a message */}
        {sprayEvent.crop ? sprayEvent.crop : "No crop entered"}
        <Link href={`/crop`} className={styles.editBtn}>
          Edit
        </Link>
      </p>
      <p className={styles.labels}>Spray</p>
      <div className={styles.sprayMixCard}>
        <div className={styles.sprayTitleDisplay}>
          <p>{sprayEvent.sprayList.name}</p>
          <Link href={`/spray`} className={styles.editBtn}>
            Edit
          </Link>
        </div>

        {/* Checks if a spray is entered else returns a message */}
        {!sprayEvent.sprayList.sprays[0].spray
          ? "No spray entered"
          : sprayEvent.sprayList.sprays.map((spray) => {
              return (
                <>
                  <div className={styles.sprayType}>
                    <p className={styles.sprayName}>{spray.spray}</p>

                    <p>
                      {spray.rate} {spray.unit} per hectares
                    </p>
                    <div className={styles.line}></div>
                  </div>
                </>
              );
            })}
      </div>
      <div className={standard.styledNext}>
        <Link href={`/spray`} className={standard.next}>
          Back
        </Link>
        <Link href={`/paddock`} className={standard.next}>
          Start again
        </Link>
      </div>
    </div>
  );
};
export default SprayDetails;
