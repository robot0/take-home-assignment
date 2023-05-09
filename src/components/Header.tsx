import React from "react";
import { Button } from "./Button";

interface HeaderProps {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
	return (
		<header className="absolute inset-x-0 top-0 h-16 p-4 flex justify-between items-center">
			<h1 className="text-4xl text-blue-500">Ned</h1>
			<Button
				className="bg-gray-200 dark:bg-gray-600 p-2 rounded"
				size="small"
				primary
				label="Dark Mode"
				type="button"
				onClick={toggleDarkMode}>
				{isDarkMode ? "Light Mode" : "Dark Mode"}
			</Button>
		</header>
	);
};

export default Header;
