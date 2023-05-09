import React from "react";

interface PercentageStatProps {
	percentage: number;
}

const PercentageStat: React.FC<PercentageStatProps> = ({ percentage }) => {
	return (
		<div className="flex items-center">
			<span className="text-lg font-semibold text-gray-900 dark:text-white">
				{percentage.toFixed(2)}%
			</span>
		</div>
	);
};

export default PercentageStat;
