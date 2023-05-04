import React from "react";

interface InputBoxProps {
	type?: "text" | "number";
	label: string;
	id: string;
	value: number | string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	required?: boolean;
	min?: number;
	max?: number;
	step?: number;
}

const InputBox: React.FC<InputBoxProps> = ({
	type = "text",
	label,
	id,
	value,
	onChange,
	placeholder,
	required = false,
	min,
	max,
	step,
}) => {
	return (
		<div className="flex flex-col">
			<label htmlFor={id} className="text-sm font-medium text-gray-600 mb-1">
				{label}
			</label>
			<input
				type={type}
				id={id}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				min={min}
				max={max}
				step={step}
				className="border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:outline-none focus:ring-0"
			/>
		</div>
	);
};

export default InputBox;
