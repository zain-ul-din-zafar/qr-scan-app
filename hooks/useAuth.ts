import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dummy user data for authentication
const users = [
  {
    name: "Admin (Name)",
    email: "admin01@gmail.com",
    password: "@12345678"
  },
  {
    name: "Employee 001",
    email: "emp01@gmail.com",
    password: "employee001password"
  },
  {
    name: "Employee 002",
    email: "emp02@gmail.com",
    password: "employee002password"
  },
  {
    name: "Employee 003",
    email: "emp03@gmail.com",
    password: "employee003password"
  },
  {
    name: "Employee 004",
    email: "emp04@gmail.com",
    password: "employee004password"
  }
];

// Keys for AsyncStorage
const USER_KEY = "authenticatedUser";

export const useAuth = () => {
  const [user, setUser] = useState<(typeof users)[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load the user from AsyncStorage when the app starts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );
    if (foundUser) {
      try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(foundUser));
        setUser(foundUser); // Set user state on successful login
        return { success: true, user: foundUser };
      } catch (error) {
        console.error("Error saving user to storage:", error);
        return { success: false, error: "Error saving user data." };
      }
    } else {
      return { success: false, error: "Invalid email or password." };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      setUser(null); // Clear user state on logout
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };

  return {
    user,
    signIn,
    signOut,
    isLoading // Indicates if the app is still loading the user session
  };
};
