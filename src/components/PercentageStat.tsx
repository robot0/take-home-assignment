import React from "react";

interface PercentageStatProps {
	revenueAmount: number;
	fundingAmount: number;
}

const PercentageStat: React.FC<PercentageStatProps> = ({ revenueAmount, fundingAmount }) => {
	const percentage = (0.156 / 6.2055 / revenueAmount) * (fundingAmount * 10);
	const change = percentage - 100;

	return (
		<div className="flex items-center">
			<span className="text-xl font-semibold text-gray-900">{(percentage * 100).toFixed(2)}%</span>
			<span
				className={`ml-2 flex items-baseline text-sm font-semibold ${
					change > 0 ? "text-green-600" : "text-red-600"
				}`}>
				{change > 0 ? "+" : ""}
				{change.toFixed(2)}%
			</span>
		</div>
	);
};

export default PercentageStat;
