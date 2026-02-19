import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export type Theme = "light" | "dark";

export type ThemeContextValue = {
	theme: Theme;
	setTheme: Dispatch<SetStateAction<Theme>>;
};

export const ThemeContext = createContext<ThemeContextValue>({
	theme: "light",
	setTheme: () => {},
});