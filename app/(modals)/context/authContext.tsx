import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isItLogined: boolean;
  logIn: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check login status on mount
  useEffect(() => {
    const persistLoginStatus = async () => {
      try {
        const loginStatus = await AsyncStorage.getItem("LoginStatus");
        setIsAuthenticated(!!loginStatus); // set to true if loginStatus exists
      } catch (error) {
        console.error("Failed to load login status from AsyncStorage", error);
      }
    };

    persistLoginStatus();
  }, []);

  const login = async () => {
    try {
      await AsyncStorage.setItem("LoginStatus", "true");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to save login status", error);
    }
  };

  const logout = () => {
    try {
      AsyncStorage.removeItem("LoginStatus");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Failed to remove login status", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isItLogined: isAuthenticated, logIn: login, logOut: logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
