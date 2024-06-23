import { useState, useEffect } from "react";
import React from "react";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { v4 as uuidv4 } from "uuid";
import { renderToString } from "react-dom/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import Error from "./_error";
import AccessDenied from "../components/accessDenied";
import { authOptions } from "./api/auth/[...nextauth]";
import styles from "../styles/Dashboard.module.css";
import prisma from "../lib/prisma";

export async function getServerSideProps(context) {
  let errorCode;
  let sprayEvents;
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      props: {},
    };
  }
  const companyId = session.user.companyId;
  // Fetch all SprayEvents and include related data from Paddock, Crop, SprayMix, and Company

  try {
    sprayEvents = await prisma.sprayEvent.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        paddock: true,
        crop: true,
        sprayMix: {
          include: {
            sprayMix: {
              include: {
                sprays: {
                  include: {
                    spray: {
                      include: {
                        sprayName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    errorCode = context.res.statusCode > 200 ? context.res.statusCode : false;
    //   Convert createdAt field to string
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code);
    } else {
      console.error(error);
    }
    context.res.statusCode = 500;
    errorCode = context.res.statusCode;
    sprayEvents = [];
  }

  const sprayEventsWithCreatedAtAsString = sprayEvents.map((sprayEvent) => {
    return {
      ...sprayEvent,
      createdAt: sprayEvent.createdAt.toString(),
    };
  });

  return {
    props: {
      sprayEvents: sprayEventsWithCreatedAtAsString,
      errorCode,
      session,
    },
  };
}

export default function SprayEventDashboard({ sprayEvents, errorCode }) {
  const { data: session } = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [paddockList, setPaddockList] = useState([]);
  const [selectedPaddock, setSelectedPaddock] = useState("");
  const [screenWidth, setScreenWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  console.log(sprayEvents);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    setIsClient(true);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const paddockNames = sprayEvents.map(
      (sprayEvent) => sprayEvent.paddock.name
    );
    const uniquePaddockNames = [...new Set(paddockNames)];
    setPaddockList(uniquePaddockNames);
  }, [sprayEvents]);

  const handleDownload = () => {
    const doc = new jsPDF();

    const filteredSprayEvents = selectedPaddock
      ? sprayEvents.filter(
          (sprayEvent) => sprayEvent.paddock.name === selectedPaddock
        )
      : sprayEvents;

    // Add a title to the document
    doc.text("Spray Events Report", 14, 16);

    // Initialize Y position for the first table
    let startY = 20;

    // Loop through each spray event and add the relevant data to the PDF
    filteredSprayEvents.forEach((event, eventIndex) => {
      const rows = [];

      // Collect data for each spray in the spray mix
      event.sprayMix.forEach((mix) => {
        mix.sprayMix.sprays.forEach((spray) => {
          rows.push([
            spray.spray.sprayName.name,
            spray.spray.rate,
            spray.spray.unit,
          ]);
        });
      });

      // Add the table for the current spray event
      doc.autoTable({
        head: [["Date", "Paddock", "Crop", "Sprays"]],
        body: [
          [
            event.date,
            event.paddock.name,
            event.crop.name,
            rows.map((row) => row.join(" ")).join("\n"),
          ],
        ],
        startY: eventIndex === 0 ? startY : doc.lastAutoTable.finalY + 10,
        styles: { cellWidth: "wrap" },
      });
    });

    doc.save("spray_events_report.pdf");
  };

  const handleRowClick = (rowId) => {
    const selectedSprayEvent = sprayEvents.find(
      (sprayEvent) => sprayEvent.id === rowId
    );
    const text = (
      <>
        <p>Date: {selectedSprayEvent.date}</p>
        <p>Paddock: {selectedSprayEvent.paddock.name}</p>
        <p>Crop: {selectedSprayEvent.crop.name}</p>
        <p>Created By: {selectedSprayEvent.createdBy}</p>
        <p>Spray Mix:</p>
        {selectedSprayEvent.sprayMix.map((mix) => (
          <div key={mix.id}>
            <p>{mix.sprayMix.title}</p>
            {mix.sprayMix.sprays.map((spray) => (
              <p key={spray.id}>
                {spray.spray.sprayName.name} ({spray.spray.rate}{" "}
                {spray.spray.unit})
              </p>
            ))}
          </div>
        ))}
      </>
    );

    Swal.fire({
      title: "Selected Spray Event",
      html: text,
    });
  };

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  if (!isClient) {
    return null; // Return null or a loading spinner until the component is rendered on the client
  }

  const filteredSprayEvents = selectedPaddock
    ? sprayEvents.filter(
        (sprayEvent) => sprayEvent.paddock.name === selectedPaddock
      )
    : sprayEvents;

  return (
    <>
      {session ? (
        <div>
          <h1>Spray Events</h1>
          {sprayEvents.length === 0 ? (
            <p>No spraying events recorded</p>
          ) : (
            <>
              <button onClick={handleDownload} className={styles.downloadBtn}>
                Download
              </button>
              <div className={styles.selectContainer}>
                <label htmlFor="paddock-select">Select a paddock:</label>
                <select
                  id="paddock-select"
                  value={selectedPaddock}
                  onChange={(event) => {
                    const paddockName = event.target.value;
                    setSelectedPaddock(paddockName);
                  }}
                >
                  <option value="">--All Paddocks--</option>
                  {paddockList.map((paddockName) => (
                    <option key={paddockName} value={paddockName}>
                      {paddockName}
                    </option>
                  ))}
                </select>
              </div>

              {screenWidth < 1000 ? (
                <div>
                  <table className={styles.tableDisplay}>
                    <thead>
                      <tr className={styles.borderDisplay}>
                        <th>Select</th>
                        <th>Date</th>
                        <th>Paddock</th>
                        <th>Crop</th>
                        <th>Created By</th>
                        <th>Spray Mix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSprayEvents.map((sprayEvent) => (
                        <tr
                          key={sprayEvent.id}
                          className={styles.borderDisplay}
                        >
                          <td>
                            <input
                              type="radio"
                              name="selectedRow"
                              value={sprayEvent.id}
                              checked={selectedRow === sprayEvent.id}
                              onChange={() => handleRowClick(sprayEvent.id)}
                            />
                          </td>
                          <td>{sprayEvent.date}</td>
                          <td>{sprayEvent.paddock.name}</td>
                          <td>{sprayEvent.crop.name}</td>
                          <td>{sprayEvent.createdBy}</td>
                          <td>
                            <table className={styles.innerTable}>
                              <tbody>
                                {sprayEvent.sprayMix.map((mix) => (
                                  <tr key={uuidv4()} className="noBorder">
                                    <td>{mix.sprayMix.title}</td>
                                    {mix.sprayMix.sprays.map((spray) => (
                                      <tr key={uuidv4()}>
                                        <td>{spray.spray.sprayName.name}</td>
                                        <td>{spray.spray.rate}</td>
                                        <td>{spray.spray.unit}</td>
                                      </tr>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.desktopContainer}>
                  <table className={styles.tableDisplay}>
                    <thead>
                      <tr className={styles.borderDisplay}>
                        <th>Select</th>
                        <th>Date</th>
                        <th>Paddock</th>
                        <th>Crop</th>
                        <th>Created By</th>
                        <th>Spray Mix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSprayEvents.map((sprayEvent) => (
                        <tr
                          key={sprayEvent.id}
                          className={styles.borderDisplay}
                        >
                          <td>
                            <input
                              type="radio"
                              name="selectedRow"
                              value={sprayEvent.id}
                              checked={selectedRow === sprayEvent.id}
                              onChange={() => setSelectedRow(sprayEvent.id)}
                            />
                          </td>
                          <td>{sprayEvent.date}</td>
                          <td>{sprayEvent.paddock.name}</td>
                          <td>{sprayEvent.crop.name}</td>
                          <td>{sprayEvent.createdBy}</td>
                          <td>
                            <table className={styles.innerTable}>
                              <tbody>
                                {sprayEvent.sprayMix.map((mix) =>
                                  mix.sprayMix.sprays.map((spray, index) => (
                                    // eslint-disable-next-line react/jsx-no-undef
                                    <React.Fragment key={uuidv4()}>
                                      {index === 0 && (
                                        <tr className="noBorder">
                                          <td className={styles.mixTitle}>
                                            {mix.sprayMix.title}
                                          </td>
                                        </tr>
                                      )}
                                      <tr>
                                        <td>{spray.spray.sprayName.name}</td>
                                        <td>{spray.spray.rate}</td>
                                        <td>{spray.spray.unit}</td>
                                      </tr>
                                    </React.Fragment>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
