import React from "react";

interface ButtonProps {
	label: string;
	type: "add" | "delete";
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<ButtonProps> = ({ label, type, onClick }) => {
	const buttonStyle =
		type === "add" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-red-600 hover:bg-red-700";

	return (
		<button
			onClick={(event) => {
				event.preventDefault();
				onClick(event);
			}}
			className={`text-white font-semibold py-2 px-4 rounded ${buttonStyle}`}>
			{label}
		</button>
	);
};

export default Button;
