import React from "react";

interface CheckBoxProps {
	id: string;
	label: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ id, label, checked, onChange }) => {
	return (
		<div className="flex items-center">
			<input
				type="checkbox"
				id={id}
				checked={checked}
				onChange={onChange}
				className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
			/>
			<label htmlFor={id} className="ml-2 text-sm text-gray-900">
				{label}
			</label>
		</div>
	);
};

export default CheckBox;
