import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

const useKeyboardSize = () => {
  const [keyboardSize, setKeyboardSize] = useState(0);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardSize(e.endCoordinates.height);
    });

    Keyboard.addListener("keyboardDidHide", (e) => {
      setKeyboardSize(e.endCoordinates.height);
    });

    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  return keyboardSize;
};

export default useKeyboardSize;
