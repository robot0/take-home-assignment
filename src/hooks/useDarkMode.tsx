import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DarkModeContextData {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextData>({} as DarkModeContextData);

export const useDarkMode = () => {
	const context = useContext(DarkModeContext);

	if (!context) {
		throw new Error("useDarkMode must be used within a DarkModeProvider");
	}

	return context;
};

interface DarkModeProviderProps {
	children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const savedDarkMode = localStorage.getItem("darkMode") === "true";
		setIsDarkMode(savedDarkMode);
	}, []);

	useEffect(() => {
		localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
		document.documentElement.classList.toggle("dark", isDarkMode);
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
		</DarkModeContext.Provider>
	);
};
