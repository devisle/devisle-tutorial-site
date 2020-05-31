import React from "react";
import { ThemeProvider } from "styled-components";
import { getTheme, ITheme } from "./Theme";
import Typography from "./Typography"

/**
 * Pass the dark mode value
 * 
 * @property {dark} boolean sets the dark mode
 * @property onToggle toggle the dark mode 
 */
export interface IThemeContext {
  dark: boolean;
  onToggle?: () => void;
}

/** Theme context */
const ThemeContext = React.createContext<IThemeContext>({
  dark: false,
});

/** Get the Theme context i.e. whether dark-mode is false or true */
const useTheme = (): IThemeContext => React.useContext(ThemeContext);

const ThemeContextProvider: React.FC = ({ children }) => {
  const [dark, setDarkTheme] = React.useState<boolean>(false);
  const theme: ITheme = dark ? getTheme("dark") : getTheme("light");

  const handleToggle = (): void => {
    setDarkTheme(!dark);
  };
  return (
    <ThemeProvider theme={{...theme, ...Typography}}>
      <ThemeContext.Provider
        value={{
          dark: false,
          onToggle: handleToggle,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

export { ThemeContextProvider, useTheme };
