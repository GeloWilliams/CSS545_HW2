import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// Define light and dark theme styles
const lightTheme = {
    backgroundColor: '#fff',
    textColor: '#000',
    buttonColor: '#6200ee',
};

const darkTheme = {
    backgroundColor: '#333',
    textColor: '#fff',
    buttonColor: '#bb86fc',
};

interface ThemeContextProps {
    isDarkTheme: boolean;
    theme: typeof lightTheme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme();
    const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');

    const toggleTheme = () => setIsDarkTheme((prevTheme) => !prevTheme);

    const theme = isDarkTheme ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDarkTheme, theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
