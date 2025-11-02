import { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState('Dashboard'); // Default selection

    return (
        <NavigationContext.Provider value={{ selectedMenu, setSelectedMenu }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigation must be used within a NavigationProvider");
    }
    return context;
};