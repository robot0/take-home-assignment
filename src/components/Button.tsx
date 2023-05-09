import React, { useMemo } from "react";

type ButtonProps = {
	primary?: boolean;
	size?: "small" | "medium" | "large";
	label: string;
	className: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const getSizeClasses = (size: "small" | "medium" | "large"): string => {
	switch (size) {
		case "small": {
			return "px-4 py-2.5";
		}
		case "large": {
			return "px-6 py-3";
		}
		default: {
			return "px-5 py-2.5";
		}
	}
};

const getModeClasses = (isPrimary: boolean): string =>
	isPrimary
		? "text-white bg-blue-400 dark:bg-blue-700"
		: "text-white bg-red-600 dark:bg-red-700 dark:text-white dark:border-white";

const BASE_BUTTON_CLASSES = "px-4 py-2.5 text-white dark:bg-blue-700";

export const Button: React.FC<ButtonProps> = ({
	primary = false,
	size = "medium",
	className = "",
	type = "button",
	label,
	onClick,
	...props
}) => {
	const computedClasses = useMemo(() => {
		const modeClass = getModeClasses(primary);
		const sizeClass = getSizeClasses(size as "small" | "medium" | "large");

		return [modeClass, sizeClass].join(" ");
	}, [primary, size]);

	return (
		<button
			type={type}
			className={`${BASE_BUTTON_CLASSES} ${computedClasses} ${className}`}
			onClick={onClick}
			{...props}>
			{label}
		</button>
	);
};
