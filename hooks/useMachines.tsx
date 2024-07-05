import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Machine from "@/types/Machine";

interface MachinesContextType {
  machines: Machine[];
  addMachine: (machine: Machine) => void;
  loadMachines: () => void;
}

const MachinesContext = createContext<MachinesContextType | undefined>(
  undefined
);

export const useMachines = () => {
  const context = useContext(MachinesContext);
  if (!context) {
    throw new Error("useMachines must be used within a MachinesProvider");
  }
  return context;
};

export const MachinesProvider = ({ children }: { children: ReactNode }) => {
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const storedMachines = await AsyncStorage.getItem("machines");
      if (storedMachines) {
        setMachines(JSON.parse(storedMachines));
      }
    } catch (error) {
      console.error("Failed to load machines from local storage", error);
    }
  };

  const addMachine = async (newMachine: Machine) => {
    try {
      const updatedMachines = [...machines, newMachine];
      setMachines(updatedMachines);
      await AsyncStorage.setItem("machines", JSON.stringify(updatedMachines));
    } catch (error) {
      console.error("Failed to save machine to local storage", error);
    }
  };

  return (
    <MachinesContext.Provider value={{ machines, addMachine, loadMachines }}>
      {children}
    </MachinesContext.Provider>
  );
};
