import React, { useState, useContext } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SprayContext from "../context/sprayEvent";
import styles from "../styles/SprayRate.module.css";
import standard from "../styles/Standard.module.css";
import AccessDenied from "../components/accessDenied";

const SprayRate = () => {
  const [sprayAmount, setSprayAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [isActive, setIsActive] = useState();
  const { event, oneMix } = useContext(SprayContext);
  const [sprayMix, setSprayMix] = oneMix;
  const [sprayEvent, setSprayEvent] = event;
  const [error, setError] = useState(false);
  const { data: session } = useSession();

  const unitList = ["Litres", "Kgs", "mls", "grams"];

  const handleSubmit = () => {
    if (sprayAmount === "" || unit === "") {
      setError("Please enter a spray amount and unit");
    } else {
      setError("");

      const newSprayMix = { ...sprayMix };

      //makespray creates first object in array so now the length is 1 for first spray
      const index = newSprayMix.sprays.length - 1;
      //copy sprays[index] then add rate and unit to it

      newSprayMix.sprays[index] = {
        ...newSprayMix.sprays[index],
        //need to copy what is already in sprays[index].spray and add rate and unit to it

        spray: {
          ...newSprayMix.sprays[index].spray,
          rate: sprayAmount,
          unit: unit,
        },
      };

      setSprayMix(newSprayMix);
    }
  };
  //Clears the last spray added to the sprayMix
  const clearSpray = () => {
    const editSprayMix = { ...sprayMix };
    editSprayMix.sprays.pop();
    setSprayMix(editSprayMix);
  };

  //Sets the unit value for the spray amount
  const handleUnitClick = (index) => {
    setUnit(unitList[index]);
    setIsActive(index);
  };

  return (
    <>
      {session ? (
        <div>
          <h1 className={standard.title}>Spray Rate</h1>

          <div className={`${standard.cardBackground} ${styles.centerInput}`}>
            <form>
              <div className={styles.sprayRate}>
                <label htmlFor="sprayAmount" className={styles.rateLabel}>
                  Rate per hectare:
                </label>
                <input
                  className={styles.rateInput}
                  aria-label="Amount"
                  id="sprayAmount"
                  type="number"
                  step="any"
                  required
                  min="0"
                  value={sprayAmount}
                  onChange={(e) => setSprayAmount(parseFloat(e.target.value))}
                />
              </div>
            </form>

            <ul className={styles.volumeBtnDisplay}>
              {unitList.map((unitL, index) => (
                <li key={index} className={styles.btnLayout} value={unit || ""}>
                  <button
                    style={{
                      background:
                        isActive == index
                          ? "linear-gradient(315deg, #26bbac,#bcfb69 )"
                          : "#faf9f6",
                      color: isActive == index ? "white" : "#3d3f40",
                      border: isActive == index ? "none" : " 1px solid #26bbac",
                    }}
                    className={styles.rateButtons}
                    onClick={() => handleUnitClick(index)}
                  >
                    {unitL}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {error && (
            <p className={standard.error}>Please enter a rate and unit</p>
          )}
          <div className={standard.styledNext}>
            <Link
              href={`/makeSpray`}
              className={standard.next}
              // clears last spray added to the sprayMix
              onClick={() => clearSpray()}
            >
              Back
            </Link>

            {sprayAmount && unit ? (
              <Link
                href={`/sprayMixDisplay`}
                className={standard.next}
                onClick={() => handleSubmit()}
              >
                Next
              </Link>
            ) : (
              <div className={standard.messageDisplay}>
                <button
                  href={``}
                  className={standard.disabledNext}
                  onClick={() => {
                    setError(true);
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default SprayRate;
