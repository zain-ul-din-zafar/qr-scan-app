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
}

const ReadingsContext = createContext<{
  readings: Reading[];
  loadReadings: () => Promise<void>;
  addReading: (reading: Reading) => Promise<void>;
}>({
  readings: [],
  loadReadings: async () => {},
  addReading: async () => {}
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

  return (
    <ReadingsContext.Provider
      value={{
        readings,
        addReading: addToStorage,
        loadReadings: loadFromStorage
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
