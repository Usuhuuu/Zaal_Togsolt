// SavedHallsContext.js
import { ReactNode } from "react";
import React, { createContext, useState, useContext } from "react";

export interface Hall {
    id: string;
    name: string;
}

interface SavedHallsContextType {
    savedHalls: Hall[];
    addHall: (hall: Hall) => void;
    removeHall: (id: string) => void;
}

const SavedHallsContext = createContext<SavedHallsContextType>({
    savedHalls: [],
    addHall: (hall: Hall) => {},
    removeHall: (id: string) => {}
});


export const SavedHallsProvider = ({ children }: { children: ReactNode }) => {
  const [savedHalls, setSavedHalls] = useState<Hall[]>([]);

const addHall = (hall: Hall) => {
    setSavedHalls((prevHalls) => [...prevHalls, hall]);
};

const removeHall = (id: string) => {
    setSavedHalls((prevHalls) => prevHalls.filter((hall) => hall.id !== id));
};

  return (
    <SavedHallsContext.Provider value={{ savedHalls, addHall, removeHall }}>
      {children}
    </SavedHallsContext.Provider>
  );
};

export const useSavedHalls = () => useContext(SavedHallsContext);