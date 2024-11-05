import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

import { Flowbite, theme as flowbiteTheme } from "flowbite-react";
import CustomFlowbiteTheme from "../components/FlowBiteTheme";
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Flowbite theme={{ theme: { ...flowbiteTheme, ...CustomFlowbiteTheme } }}>
        {children}
      </Flowbite>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
