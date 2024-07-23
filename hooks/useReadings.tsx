import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useContext,
  useEffect
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Reading {
  uid: string;
  inletPressure: number;
  outletPressure: number;
  created_at: Date;
  diffPressureIndication: number;
  oilLevel: string;
  oilPressureStatus?: "Low" | "Good";
  newOptionStatus?: "on" | "off" | "isolated";
}

const ReadingsContext = createContext<{
  readings: Reading[];
  loadReadings: () => Promise<void>;
  addReading: (reading: Reading) => Promise<void>;
  deleteReading: (uid: string, date: Date) => Promise<void>;
}>({
  readings: [],
  loadReadings: async () => {},
  addReading: async () => {},
  deleteReading: async () => {}
});

export const ReadingsProvider = ({ children }: { children: ReactNode }) => {
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const load = async () => await loadFromStorage();
    load();
  }, []);

  const loadFromStorage = useCallback(async () => {
    const existingData = await AsyncStorage.getItem("readings");
    const parsedData = existingData ? JSON.parse(existingData) : [];
    setReadings(parsedData);
    return parsedData;
  }, []);

  const addToStorage = useCallback(async (reading: Reading) => {
    const existingData = await AsyncStorage.getItem("readings");
    const parsedData = existingData ? JSON.parse(existingData) : [];
    parsedData.push(reading);
    await AsyncStorage.setItem("readings", JSON.stringify(parsedData));
    setReadings(parsedData);
  }, []);

  const deleteFromStorage = useCallback(async (uid: string, date: Date) => {
    const existingData = await AsyncStorage.getItem("readings");

    const filterResults = (
      (existingData ? JSON.parse(existingData) : []) as Reading[]
    ).filter((v) => {
      return !(v.uid === uid && v.created_at.getTime() === date.getTime());
    });

    await AsyncStorage.setItem("readings", JSON.stringify(filterResults));
    setReadings(filterResults);
  }, []);

  return (
    <ReadingsContext.Provider
      value={{
        readings,
        addReading: addToStorage,
        loadReadings: loadFromStorage,
        deleteReading: deleteFromStorage
      }}
    >
      {children}
    </ReadingsContext.Provider>
  );
};

const useReadings = () => {
  return useContext(ReadingsContext);
};

export default useReadings;
