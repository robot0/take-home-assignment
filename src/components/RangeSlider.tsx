import React from "react";

interface RangeSliderProps {
	min: number;
	max: number;
	initialValue?: number;
	value: number;
	step: number;
	onChange: (value: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
	min,
	max,
	initialValue = min,
	value,
	step,
	onChange,
}) => {
	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(parseFloat(e.target.value));
	};

	return (
		<div className="relative w-full">
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={handleSliderChange}
				className="w-full h-1 bg-gray-200 cursor-pointer focus:outline-none focus:ring-0"
			/>
			<span className="absolute ml-2 text-blue-500">${value.toLocaleString()}</span>
			<div className="flex justify-between text-sm font-medium text-gray-600 dark:text-white">
				<span>{min}</span>
				<span>{max}</span>
			</div>
		</div>
	);
};

export default RangeSlider;
