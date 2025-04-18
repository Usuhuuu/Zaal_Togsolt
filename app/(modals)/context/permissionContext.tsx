import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

interface PermissionContextProps {
  notificaitons: boolean;
  location: boolean;
  trackRequest: boolean;
  enablePermissions: (permission: keyof PermissionContextProps) => void;
  disablePermissions: (permission: keyof PermissionContextProps) => void;
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined
);

export const PermissionContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [permissions, setPermissions] = useState<PermissionContextProps>({
    notificaitons: false,
    location: false,
    trackRequest: false,
    enablePermissions: () => {},
    disablePermissions: () => {},
  });
  const persistPermissions = async () => {
    try {
      const storedPermissions = await AsyncStorage.getItem("permissions");
      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);
        setPermissions((prev) => ({
          ...prev,
          ...parsedPermissions,
        }));
      }
    } catch (err) {
      console.error("Failed to persist permissions", err);
    }
  };
  const enablePermissions = async (
    permission: keyof PermissionContextProps
  ) => {
    try {
      await AsyncStorage.setItem(
        "permissions",
        JSON.stringify({
          ...permissions,
          [permission]: true,
        })
      );
      setPermissions((prev) => ({
        ...prev,
        [permission]: true,
      }));
    } catch (err) {
      console.error("Failed to enable permission", err);
    }
  };
  const disablePermissions = async (
    permission: keyof PermissionContextProps
  ) => {
    try {
      await AsyncStorage.setItem(
        "permissions",
        JSON.stringify({
          ...permissions,
          [permission]: false,
        })
      );
      setPermissions((prev) => ({
        ...prev,
        [permission]: false,
      }));
    } catch (Err) {
      console.error("Failed to disable permission", Err);
    }
  };

  return (
    <PermissionContext.Provider
      value={{
        notificaitons: permissions.notificaitons,
        location: permissions.location,
        trackRequest: permissions.trackRequest,
        enablePermissions,
        disablePermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};
