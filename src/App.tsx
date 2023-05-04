import { useState, useEffect } from "react";
import InputBox from "./components/InputBox";
import RangeSlider from "./components/RangeSlider";
import ComboBoxComponent from "./components/ComboBox";
import CheckBox from "./components/CheckBox";
import PercentageStat from "./components/PercentageStat";
import FundUsesList from "./components/FundUsesList";

// Options for Funds Use
const fundUseOptions = [
	{ id: 1, name: "Marketing" },
	{ id: 2, name: "Personnel" },
	{ id: 3, name: "Working Capital" },
	{ id: 4, name: "Inventory" },
	{ id: 5, name: "Machinery/Equipment" },
	{ id: 6, name: "Other" },
];

// Options for Repayment Delays
const delayOptions = [
	{ id: 1, name: "30 days" },
	{ id: 2, name: "60 days" },
	{ id: 3, name: "90 days" },
];

function App() {
	// Revenue Shared Frequency Logic
	const [monthlyCheckBoxValue, setMonthlyCheckBoxValue] = useState(false);
	const [weeklyCheckBoxValue, setWeeklyCheckBoxValue] = useState(false);

	const handleMonthlyCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMonthlyCheckBoxValue(e.target.checked);
		setWeeklyCheckBoxValue(false);
	};

	const handleWeeklyCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWeeklyCheckBoxValue(e.target.checked);
		setMonthlyCheckBoxValue(false);
	};

	// Desired Payment Delays Logic
	const [selectedDelayOption, setSelectedDelayOption] = useState(delayOptions[0]?.id || 0);

	const handleDelayChange = (selectedValue: any) => {
		setSelectedDelayOption(selectedValue);
	};

	// Funding Amount Logic
	const [revenueAmount, setRevenueAmount] = useState(250000);
	const [fundingAmount, setFundingAmount] = useState(revenueAmount / 3);

	useEffect(() => {
		if (revenueAmount === 250000) {
			setFundingAmount(60000);
		} else {
			setFundingAmount(revenueAmount / 3);
		}
	}, [revenueAmount]);

	// InputBox logic
	const handleRevenueAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRevenueAmount(parseFloat(e.target.value));
	};

	// Range Slider logic
	const handleSliderChange = (value: number) => {
		setFundingAmount(value);
	};

	// Fee Percentage logic
	// eslint-disable-next-line
	const [desiredFeePercentage, setDesiredFeePercentage] = useState(0.5);

	const calculateFees = (fundingAmount: number, desiredFeePercentage: number) => {
		const fees = fundingAmount * desiredFeePercentage;
		return { percentage: desiredFeePercentage * 100, fees };
	};

	const feesData = calculateFees(fundingAmount, desiredFeePercentage);

	// Total Revenue Share Logic
	const calculateTotalRevenueShare = (fundingAmount: number, fees: number) => {
		return fundingAmount + fees;
	};

	const totalRevenueShare = calculateTotalRevenueShare(fundingAmount, feesData.fees);

	// Expected Transfers Logic

	const calculateExpectedTransfers = (
		totalRevenueShare: number,
		revenueAmount: number,
		desiredFeePercentage: number,
		revenueShareFrequency: string,
	) => {
		if (revenueShareFrequency === "weekly") {
			return (totalRevenueShare * 52) / (revenueAmount * desiredFeePercentage);
		} else if (revenueShareFrequency === "monthly") {
			return (totalRevenueShare * 12) / (revenueAmount * desiredFeePercentage);
		} else {
			throw new Error("Invalid revenueShareFrequency value");
		}
	};

	const revenueShareFrequency = weeklyCheckBoxValue ? "weekly" : "monthly";

	const [expectedTransfers, setExpectedTransfers] = useState(0);

	useEffect(() => {
		const calculatedExpectedTransfers = calculateExpectedTransfers(
			totalRevenueShare,
			revenueAmount,
			desiredFeePercentage,
			revenueShareFrequency,
		);
		setExpectedTransfers(calculatedExpectedTransfers);
	}, [revenueShareFrequency, totalRevenueShare, revenueAmount, desiredFeePercentage]);

	// Calculate expected completion date
	const currentDate = new Date();
	const expectedTransferTime = weeklyCheckBoxValue ? expectedTransfers * 7 : expectedTransfers * 30;
	const desiredRepaymentDelay =
		selectedDelayOption === 1 ? 30 : selectedDelayOption === 2 ? 60 : 90;
	const expectedCompletionDate = new Date(
		currentDate.getTime() + (expectedTransferTime + desiredRepaymentDelay) * 24 * 60 * 60 * 1000,
	);

	return (
		<div className="App">
			<div className="bg-white">
				{/* Background color split screen for large screens */}
				<div
					className="fixed top-0 left-0 hidden h-full w-1/2 bg-white lg:block"
					aria-hidden="true"
				/>
				<div
					className="fixed top-0 right-0 hidden h-full w-1/2 bg-gray-50 lg:block"
					aria-hidden="true"
				/>

				<main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
					<h1 className="sr-only">Results</h1>

					<section
						aria-labelledby="results-heading"
						className="bg-gray-50 px-4 pt-16 pb-10 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16">
						<div className="mx-auto max-w-lg lg:max-w-none">
							<h2 id="summary-heading" className="text-lg font-medium text-gray-900">
								Results
							</h2>
							<dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
								<div className="flex items-center justify-between">
									<dt className="text-gray-600">Annual Business Revenue</dt>
									<dd>{revenueAmount}</dd>
								</div>

								<div className="flex items-center justify-between">
									<dt className="text-gray-600">Funding Amount</dt>
									<dd>{fundingAmount}</dd>
								</div>

								<div className="flex items-center justify-between">
									<dt className="text-gray-600">Fees</dt>
									<dd>
										${feesData.percentage.toFixed(0)}% ${feesData.fees.toFixed(2)}
									</dd>
								</div>

								<div className="flex items-center justify-between border-t border-gray-200 pt-4">
									<dt className="text-base text-gray-600">Total Revenue Share</dt>
									<dd className="text-base">{totalRevenueShare}</dd>
								</div>
								<div className="flex items-center justify-between pt-1">
									<dt className="text-base text-gray-600">Expected transfers</dt>
									<dd className="text-base">{expectedTransfers}</dd>
								</div>
								<div className="flex items-center justify-between pt-1">
									<dt className="text-base text-gray-600">Expected completion date</dt>
									<dd className="text-base">
										{expectedCompletionDate.toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</dd>
								</div>
							</dl>
						</div>
					</section>
					<form className="px-4 pt-16 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
						<div className="mx-auto max-w-lg lg:max-w-none">
							<section aria-labelledby="contact-info-heading">
								<h2 id="contact-info-heading" className="text-lg font-medium text-gray-900">
									Financing Options
								</h2>

								<div className="mt-6">
									<div className="mt-1">
										<InputBox
											type="number"
											label="What is your annual business revenue?"
											id="name"
											value={revenueAmount}
											onChange={handleRevenueAmount}
											placeholder="$250,000"
										/>
									</div>
								</div>
							</section>

							<section aria-labelledby="loan-amount-heading" className="mt-10">
								<div className="mt-6 grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-4">
									<div className="col-span-3 sm:col-span-4">
										<label
											htmlFor="desired-loan-amount"
											className="block text-sm font-medium text-gray-700">
											What is your desired loan amount?
										</label>
										<div className="mt-1">
											<RangeSlider
												min={50000}
												max={83000}
												initialValue={fundingAmount}
												value={fundingAmount}
												onChange={handleSliderChange}
											/>
										</div>
									</div>
								</div>

								<div className="mt-6 flex flex-row gap-2">
									<label
										htmlFor="revenue-share-percentage"
										className="mt-1 block text-sm font-medium text-gray-700">
										Revenue Share Percentage:
									</label>
									<div className="mb-4">
										<PercentageStat revenueAmount={revenueAmount} fundingAmount={fundingAmount} />
									</div>
								</div>

								<div className="mt-4 flex flex-row gap-4">
									<label
										htmlFor="revenue-shared-freq"
										className="block text-sm font-medium text-gray-700">
										Revenue Shared Frequency
									</label>
									<div className="mt-2">
										<CheckBox
											id="monthly"
											label="Monthly"
											checked={monthlyCheckBoxValue}
											onChange={handleMonthlyCheckBoxChange}
										/>
										<CheckBox
											id="weekly"
											label="Weekly"
											checked={weeklyCheckBoxValue}
											onChange={handleWeeklyCheckBoxChange}
										/>
									</div>
								</div>

								<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
									<div className="sm:col-span-3">
										<label htmlFor="address" className="block text-sm font-medium text-gray-700">
											Desired Payment Delays
										</label>
										<div className="mt-1">
											<ComboBoxComponent
												data={delayOptions}
												label=""
												onChange={handleDelayChange}
											/>
										</div>
									</div>
								</div>
							</section>

							<>
								<FundUsesList fundUseOptions={fundUseOptions} />
							</>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
}

export default App;
