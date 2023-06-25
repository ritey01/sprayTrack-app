import { useState } from "react";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
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
  console.log(sprayEvents);
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  return (
    <>
      {session ? (
        <div>
          <h1>Spray Events</h1>
          {sprayEvents.length == 0 ? (
            <p>No spraying events recorded</p>
          ) : (
            <>
              {/* This would be for mobile only */}
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
                  {sprayEvents.map((sprayEvent) => (
                    <tr key={sprayEvent.id} className={styles.borderDisplay}>
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
                        <table>
                          <tbody>
                            {sprayEvent.sprayMix.map((mix, index) => (
                              <tr key={index} class="noBorder">
                                <td>{mix.sprayMix.title}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Create another with all the details of SprayEvent displayed for desktop */}
            </>
          )}
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
