import React from "react";

interface PercentageStatProps {
	revenueAmount: number;
	fundingAmount: number;
}

const PercentageStat: React.FC<PercentageStatProps> = ({ revenueAmount, fundingAmount }) => {
	const percentage = (0.156 / 6.2055 / revenueAmount) * (fundingAmount * 10);

	return (
		<div className="flex items-center">
			<span className="text-lg font-semibold text-gray-900">{(percentage * 100).toFixed(2)}%</span>
		</div>
	);
};

export default PercentageStat;
