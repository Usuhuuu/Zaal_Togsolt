import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCameraPermissions } from "expo-camera";
import { Text } from "react-native";

interface PermissionContextProps {
  notificaitons: boolean;
  location: boolean;
  trackRequest: boolean;
  camera: boolean;
  microphone: boolean;
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
    camera: false,
    microphone: false,
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
  useEffect(() => {
    persistPermissions();
  }, []);

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

  const [permission, requestPermission] = useCameraPermissions();
  if (!permission) {
    requestPermission();
  }
  if (!permission?.granted) {
    return <Text>Permission not granted</Text>;
  }

  return (
    <PermissionContext.Provider
      value={{
        notificaitons: permissions.notificaitons,
        location: permissions.location,
        trackRequest: permissions.trackRequest,
        camera: permissions.camera,
        microphone: permissions.microphone,
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
