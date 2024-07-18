import { createContext, ReactNode, useContext } from "react";

const HARD_CODED_DATA = {
  "C.O. FORWARDING PUMP M": [
    {
      id: "0000 0046 0042",
      name: "5600A"
    },
    {
      id: "0000 0046 0043",
      name: "5600B"
    },
    {
      id: "0000 0046 0044",
      name: "5600C"
    },
    {
      id: "0000 0046 0045",
      name: "5600D"
    },
    {
      id: "0000 0046 0051",
      name: "5700A"
    },
    {
      id: "0000 0046 0057",
      name: "5700B"
    },
    {
      id: "0000 0046 0058",
      name: "5700C"
    },
    {
      id: "0000 0046 0061",
      name: "5700D"
    },
    {
      id: "0000 0046 0064",
      name: "5800A"
    },
    {
      id: "0000 0046 0067",
      name: "5800B"
    },
    {
      id: "0000 0046 0070",
      name: "5800C"
    },
    {
      id: "0000 0046 0073",
      name: "5800D"
    },
    {
      id: "0000 0046 0076",
      name: "5900A"
    },
    {
      id: "0000 0046 0079",
      name: "5900B"
    },
    {
      id: "0000 0046 0502",
      name: "5900C"
    },
    {
      id: "0000 0046 0505",
      name: "5900D"
    }
  ],
  "C.O. FORWARDING PUMP STAGE 5 M": [
    {
      id: "0000 0046 0785",
      name: "5100A"
    },
    {
      id: "0000 0046 0791",
      name: "5100B"
    },
    {
      id: "0000 0046 0794",
      name: "5100C"
    },
    {
      id: "0000 0046 0797",
      name: "5100D"
    },
    {
      id: "0000 0046 0799",
      name: "5200A"
    },
    {
      id: "0000 0046 1133",
      name: "5200B"
    },
    {
      id: "0000 0046 1136",
      name: "5200C"
    },
    {
      id: "0000 0046 1139",
      name: "5200D"
    },
    {
      id: "0000 0046 1142",
      name: "5300A"
    },
    {
      id: "0000 0046 1145",
      name: "5300B"
    },
    {
      id: "0000 0046 1148",
      name: "5300C"
    },
    {
      id: "0000 0046 1151",
      name: "5300D"
    },
    {
      id: "0000 0046 1157",
      name: "5400A"
    },
    {
      id: "0000 0046 1158",
      name: "5400B"
    },
    {
      id: "0000 0046 1159",
      name: "5400C"
    },
    {
      id: "0000 0046 1160",
      name: "5400D"
    },
    {
      id: "0000 0046 1169",
      name: "5500A"
    },
    {
      id: "0000 0046 1170",
      name: "5500B"
    },
    {
      id: "0000 0046 1171",
      name: "5500C"
    },
    {
      id: "0000 0046 1172",
      name: "5500D"
    }
  ],
  "DIESAL F. PUMP 5": [
    {
      id: "0000 0046 6101",
      name: "6100A"
    },
    {
      id: "0000 0046 6102",
      name: "6100B"
    },
    {
      id: "0000 0046 6201",
      name: "6200A"
    },
    {
      id: "0000 0046 6202",
      name: "6200B"
    },
    {
      id: "0000 0046 6301",
      name: "6300A"
    },
    {
      id: "0000 0046 0816",
      name: "6300B"
    },
    {
      id: "0000 0046 0808",
      name: "6400A"
    },
    {
      id: "0000 0046 0810",
      name: "6400B"
    },
    {
      id: "0000 0046 0802",
      name: "6500A"
    },
    {
      id: "0000 0046 6502",
      name: "6500B"
    }
  ],
  "STAGE 7 DIESAL": [
    {
      id: "0000 0046 6601",
      name: "6600A"
    },
    {
      id: "0000 0046 6602",
      name: "6600B"
    },
    {
      id: "0000 0046 0547",
      name: "6700A"
    },
    {
      id: "0000 0046 6702",
      name: "6700B"
    },
    {
      id: "0000 0046 0553",
      name: "6800A"
    },
    {
      id: "0000 0046 6801",
      name: "6800B"
    },
    {
      id: "0000 0046 6901",
      name: "6900A"
    },
    {
      id: "0000 0046 6902",
      name: "6900B"
    }
  ]
};

const Context = createContext(HARD_CODED_DATA);

export const ComposeEquipmentsProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  return (
    <Context.Provider value={HARD_CODED_DATA}>{children}</Context.Provider>
  );
};

export const useComposeEquipments = () => useContext(Context);
