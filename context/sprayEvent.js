import { createContext, useState } from "react";

const SprayContext = createContext();

export function SprayProvider({ children }) {
  const initialState = {
    paddockId: null,
    paddock: "",
    cropId: null,
    crop: "",
    date: "",
    sprayMix: [],
  };

  //This is for the sprayMix added to sprayEvent which can contain a list
  //of spray concoctions instead of a single spray created and entered into database
  const mixMultiInitial = {
    sprays: [],
  };

  const singleSprayMix = {
    id: null,
    title: "",
    sprays: [],
  };
  //SingleSprayMix example
  // {
  //   title: "My single sprayMix",
  //   companyId:1,
  //   id:5,
  //   is_displayed:true,
  //   sprays:[
  //       {
  //       id:1,
  //       sprayId: 10,
  //       sprayMixId: 5,
  //       spray: {
  //         id: 38
  //         is_displayed: true
  //         rate: 2.1
  //         sprayName: {
  //           id: 3,
  //           name: 'Roundup',
  //           is_displayed: true,
  //           companyId: 1
  //         }
  //         sprayNameId: 3
  //         unit: "Litres"
  //       }
  //     }
  //   ]

  const companyIdInit = null;
  const [sprayEvent, setSprayEvent] = useState(initialState);
  const [sprayMix, setSprayMix] = useState(mixMultiInitial);
  const [companyId, setCompanyId] = useState(companyIdInit);
  const [oneSprayMix, setOneSprayMix] = useState(singleSprayMix);
  return (
    <SprayContext.Provider
      value={{
        event: [sprayEvent, setSprayEvent],
        mix: [sprayMix, setSprayMix],
        company: [companyId, setCompanyId],
        oneMix: [oneSprayMix, setOneSprayMix],
      }}
    >
      {children}
    </SprayContext.Provider>
  );
}

export default SprayContext;
