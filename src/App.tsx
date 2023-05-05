import { useState, useEffect } from "react";
import axios from "axios";
import InputBox from "./components/InputBox";
import RangeSlider from "./components/RangeSlider";
import ComboBoxComponent from "./components/ComboBox";
import CheckBox from "./components/CheckBox";
import PercentageStat from "./components/PercentageStat";
import FundUsesList from "./components/FundUsesList";

function App() {
	// Config state variable
	const [config, setConfig] = useState<any[]>([]);

	// Function to fetch JSON configuration
	const fetchConfig = async () => {
		try {
			const response = await axios.get(
				"https://raw.githubusercontent.com/Ned-Helps/demo-repository/main/config.json",
			);
			setConfig(response.data);
		} catch (error) {
			console.error("Error fetching config: ", error);
		}
	};

	// Call fetchConfig on component mount
	useEffect(() => {
		fetchConfig();
	}, []);

	// Options for Fund Uses
	const fundUseOptions = config
		.filter((item) => item.name === "use_of_funds")
		.map((item) =>
			item.value
				.split("*")
				.map((option: string, index: number) => ({ id: index + 1, name: option })),
		)
		.flat();

	// Revenue Shared Frequency Logic
	const revenueSharedFrequencyFromConfig =
		config.find((item) => item.name === "revenue_shared_frequency")?.value || "monthly";

	const [monthlyCheckBoxValue, setMonthlyCheckBoxValue] = useState(
		revenueSharedFrequencyFromConfig === "monthly",
	);
	const [weeklyCheckBoxValue, setWeeklyCheckBoxValue] = useState(
		revenueSharedFrequencyFromConfig === "weekly",
	);

	const handleMonthlyCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMonthlyCheckBoxValue(e.target.checked);
		setWeeklyCheckBoxValue(false);
	};

	const handleWeeklyCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWeeklyCheckBoxValue(e.target.checked);
		setMonthlyCheckBoxValue(false);
	};

	// Desired Payment Delays Logic
	const delayOptions = config
		.filter((item) => item.name === "desired_repayment_delay")
		.map((item) =>
			item.value
				.split("*")
				.map((option: string, index: number) => ({ id: index + 1, name: option })),
		)
		.flat();

	const desiredRepaymentDelayFromConfig =
		config.find((item) => item.name === "desired_repayment_delay")?.value || delayOptions[0]?.id;

	const [selectedDelayOption, setSelectedDelayOption] = useState(desiredRepaymentDelayFromConfig);

	const handleDelayChange = (selectedValue: any) => {
		setSelectedDelayOption(selectedValue);
	};

	// Funding Amount (Min/Max)
	const fundingAmountMin = config.find((item) => item.name === "funding_amount_min")?.value;
	const fundingAmountMax = config.find((item) => item.name === "funding_amount_max")?.value;

	// Revenue Amount and Funding Amount
	const defaultRevenueAmount =
		config.find((item) => item.name === "revenue_amount")?.value || 250000;

	const defaultFundingAmount = () => {
		const fundingAmountConfig = config.find((item) => item.name === "funding_amount")?.value;
		if (fundingAmountConfig) {
			const dividedAmount = parseFloat(fundingAmountConfig.split("/")[1]);
			return defaultRevenueAmount / dividedAmount;
		}
		return 60000;
	};

	const revenueAmountConfig = config.find((item) => item.name === "revenue_amount");
	const revenueAmountLabel = revenueAmountConfig?.label || "What is your annual business revenue?";
	const revenueAmountPlaceholder = revenueAmountConfig?.placeholder || "$250,000";

	const [revenueAmount, setRevenueAmount] = useState(defaultRevenueAmount);
	const [fundingAmount, setFundingAmount] = useState(defaultFundingAmount());

	// InputBox logic
	const handleRevenueAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRevenueAmount(parseFloat(e.target.value));
	};

	// Revenue Percentage logic
	const revenuePercentageFromConfig = config.find(
		(item) => item.name === "revenue_percentage",
	)?.value;
	const revenuePercentageMinFromConfig = config.find(
		(item) => item.name === "revenue_percentage_min",
	)?.value;
	const revenuePercentageMaxFromConfig = config.find(
		(item) => item.name === "revenue_percentage_max",
	)?.value;

	// Calculating the Revenue Percentage Logic
	const calculatePercentage = (revenueAmount: number, fundingAmount: number) => {
		const formula = revenuePercentageFromConfig;

		if (!formula) {
			return 0;
		}

		// eslint-disable-next-line
		const percentage = new Function("revenue_amount", "funding_amount", `return ${formula}`);
		return percentage(revenueAmount, fundingAmount);
	};

	// Add a new state variable for revenue percentage
	// eslint-disable-next-line
	const [revenuePercentage, setRevenuePercentage] = useState(
		calculatePercentage(revenueAmount, fundingAmount),
	);

	// Desired Fee Percentage logic
	const desiredFeePercentageFromConfig = config.find(
		(item) => item.name === "desired_fee_percentage",
	)?.value;

	// Calculate fees
	const calculateFees = (fundingAmount: number, desiredFeePercentageFromConfig: number) => {
		const fees = fundingAmount * desiredFeePercentageFromConfig;
		return { percentage: desiredFeePercentageFromConfig * 100, fees };
	};

	const feesData = calculateFees(fundingAmount, desiredFeePercentageFromConfig);

	// Range Slider logic
	const handleSliderChange = (value: number) => {
		const newPercentage = value / revenueAmount;
		if (
			newPercentage >= parseFloat(revenuePercentageMinFromConfig) &&
			newPercentage <= parseFloat(revenuePercentageMaxFromConfig)
		) {
			setRevenuePercentage(newPercentage);
		}
		setFundingAmount(value);
		setRevenuePercentage(newPercentage);
	};

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

	// Expected Transfers Logic
	const [expectedTransfers, setExpectedTransfers] = useState(0);

	useEffect(() => {
		const calculatedExpectedTransfers = Math.ceil(
			calculateExpectedTransfers(
				totalRevenueShare,
				revenueAmount,
				desiredFeePercentageFromConfig,
				revenueShareFrequency,
			),
		);
		setExpectedTransfers(calculatedExpectedTransfers);
	}, [revenueShareFrequency, totalRevenueShare, revenueAmount, desiredFeePercentageFromConfig]);

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
									<dd>${revenueAmount}</dd>
								</div>

								<div className="flex items-center justify-between">
									<dt className="text-gray-600">Funding Amount</dt>
									<dd>${fundingAmount}</dd>
								</div>

								<div className="flex items-center justify-between">
									<dt className="text-gray-600">Fees</dt>
									<dd>
										({feesData.percentage.toFixed(0)}% ) ${feesData.fees.toFixed(2)}
									</dd>
								</div>

								<div className="flex items-center justify-between border-t border-gray-200 pt-4">
									<dt className="text-base text-gray-600">Total Revenue Share</dt>
									<dd className="text-base">${totalRevenueShare}</dd>
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
											label={revenueAmountLabel}
											id="name"
											value={revenueAmount}
											onChange={handleRevenueAmount}
											placeholder={revenueAmountPlaceholder}
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
												min={fundingAmountMin}
												max={fundingAmountMax}
												step={1}
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
										<PercentageStat
											percentage={calculatePercentage(revenueAmount, fundingAmount)}
										/>
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
						<section className="mt-10">
							<div className="flex justify-between">
								<button
									className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg"
									onClick={() => {}}>
									Previous Page
								</button>
								<button
									className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg"
									onClick={() => {}}>
									Next Page
								</button>
							</div>
						</section>
					</form>
				</main>
			</div>
		</div>
	);
}

export default App;
