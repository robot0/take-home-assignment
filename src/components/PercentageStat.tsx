import React from "react";

interface PercentageStatProps {
	percentage: number;
}

const PercentageStat: React.FC<PercentageStatProps> = ({ percentage }) => {
	return (
		<div className="flex items-center">
			<span className="text-lg font-semibold text-gray-900">{(percentage * 100).toFixed(2)}%</span>
		</div>
	);
};

export default PercentageStat;
