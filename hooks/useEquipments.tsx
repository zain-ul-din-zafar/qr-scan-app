import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useContext,
  useEffect
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EquipmentsContext = createContext<{
  equipments: {
    [key: string]: string;
  };
  loadEquipments: () => Promise<void>;
  addEquipment: (key: string, value: string) => Promise<void>;
  deleteEquipment: (key: string) => Promise<void>;
}>({
  equipments: {},
  loadEquipments: async () => {},
  addEquipment: async (_, __) => {},
  deleteEquipment: async () => {}
});

export const EquipmentsProvider = ({ children }: { children: ReactNode }) => {
  const [equipments, setEquipments] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const load = async () => await loadFromStorage();
    load();
  }, []);

  const loadFromStorage = useCallback(async () => {
    const existingData = await AsyncStorage.getItem("equipmentData");
    const parsedData = existingData ? JSON.parse(existingData) : {};
    setEquipments(parsedData);
    return parsedData;
  }, []);

  const addToStorage = useCallback(async (key: string, value: string) => {
    const existingData = await AsyncStorage.getItem("equipmentData");
    const parsedData = existingData ? JSON.parse(existingData) : {};
    parsedData[key] = value;
    await AsyncStorage.setItem("equipmentData", JSON.stringify(parsedData));
    setEquipments(parsedData);
  }, []);

  const deleteFromStorage = useCallback(async (key: string) => {
    const existingData = await AsyncStorage.getItem("equipmentData");
    const parsedData = existingData ? JSON.parse(existingData) : {};
    delete parsedData[key];
    await AsyncStorage.setItem("equipmentData", JSON.stringify(parsedData));
    setEquipments(parsedData);
  }, []);

  return (
    <EquipmentsContext.Provider
      value={{
        equipments,
        addEquipment: addToStorage,
        deleteEquipment: deleteFromStorage,
        loadEquipments: loadFromStorage
      }}
    >
      {children}
    </EquipmentsContext.Provider>
  );
};

const useEquipments = () => {
  return useContext(EquipmentsContext);
};

export default useEquipments;
