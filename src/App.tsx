import { useState, useEffect } from "react";
import axios from "axios";
import { useDarkMode } from "./hooks/useDarkMode";
import InputBox from "./components/InputBox";
import RangeSlider from "./components/RangeSlider";
import ComboBoxComponent from "./components/ComboBox";
import CheckBox from "./components/CheckBox";
import PercentageStat from "./components/PercentageStat";
import FundUsesList from "./components/FundUsesList";
import Header from "./components/Header";

function App() {
	// Dark mode logic
	const { isDarkMode, toggleDarkMode } = useDarkMode();

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

	const defaultDelayOption = delayOptions.find(
		(option) => option.name === desiredRepaymentDelayFromConfig,
	);

	const [selectedDelayOption, setSelectedDelayOption] = useState(defaultDelayOption?.id);

	const handleDelayChange = (selectedValue: any) => {
		setSelectedDelayOption(selectedValue.id);
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
		setRevenueAmount(Number(e.target.value));
	};

	// Revenue Percentage logic
	const revenuePercentageMinFromConfig = config.find(
		(item) => item.name === "revenue_percentage_min",
	)?.value;
	const revenuePercentageMaxFromConfig = config.find(
		(item) => item.name === "revenue_percentage_max",
	)?.value;

	// Calculating the Revenue Percentage Logic
	const calculatePercentage = (revenueAmount: number, fundingAmount: number) => {
		const percentage = (0.156 / 6.2055 / revenueAmount) * (fundingAmount * 10) * 100;

		const revenuePercentageMin = parseFloat(revenuePercentageMinFromConfig);
		const revenuePercentageMax = parseFloat(revenuePercentageMaxFromConfig);

		if (percentage < revenuePercentageMin) {
			return revenuePercentageMin;
		} else if (percentage > revenuePercentageMax) {
			return revenuePercentageMax;
		} else {
			return percentage;
		}
	};

	// Add a new state variable for revenue percentage
	const [revenuePercentage, setRevenuePercentage] = useState(() =>
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
		const newPercentage = calculatePercentage(revenueAmount, value);
		if (
			newPercentage >= parseFloat(revenuePercentageMinFromConfig) &&
			newPercentage <= parseFloat(revenuePercentageMaxFromConfig)
		) {
			setRevenuePercentage(newPercentage);
		}
		setFundingAmount(value);
	};

	// Total Revenue Share Logic
	const calculateTotalRevenueShare = (fundingAmount: number, fees: number) => {
		return fundingAmount + fees;
	};

	const totalRevenueShare = calculateTotalRevenueShare(fundingAmount, feesData.fees);

	// Revenue share frequency logic
	const revenueShareFrequency = weeklyCheckBoxValue ? "weekly" : "monthly";

	// Expected Transfers Logic
	const [expectedTransfers, setExpectedTransfers] = useState(0);

	const calculateExpectedTransfers = (
		totalRevenueShare: number,
		revenueAmount: number,
		revenuePercentage: number,
		revenueShareFrequency: string,
	) => {
		if (revenueShareFrequency === "weekly") {
			const weeklyExpectedTransfers =
				(totalRevenueShare * 52) / (revenueAmount * (revenuePercentage / 100));
			return weeklyExpectedTransfers;
		} else if (revenueShareFrequency === "monthly") {
			const monthlyExpectedTransfers =
				(totalRevenueShare * 12) / (revenueAmount * (revenuePercentage / 100));
			return monthlyExpectedTransfers;
		} else {
			throw new Error("Invalid Revenue Share Frequency value");
		}
	};

	useEffect(() => {
		const calculatedExpectedTransfers = Math.ceil(
			calculateExpectedTransfers(
				totalRevenueShare,
				revenueAmount,
				revenuePercentage,
				revenueShareFrequency,
			),
		);
		setExpectedTransfers(calculatedExpectedTransfers);
	}, [revenueShareFrequency, totalRevenueShare, revenueAmount, revenuePercentage]);

	// Calculate expected completion date
	const currentDate = new Date();
	const expectedTransferTime = Math.ceil(expectedTransfers);
	const selectedDelayOptionObject = delayOptions.find(
		(option) => option.id === selectedDelayOption,
	);
	const desiredRepaymentDelay = selectedDelayOptionObject
		? parseInt(selectedDelayOptionObject.name)
		: 30;
	const expectedCompletionDate = new Date(
		currentDate.getTime() + (expectedTransferTime + desiredRepaymentDelay) * 24 * 60 * 60 * 1000,
	);

	return (
		<div className="App">
			<div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
				{/* Background color split screen for large screens */}
				<Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
				<div
					className="fixed left-0 hidden h-full w-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white lg:block"
					aria-hidden="true"
				/>
				<div
					className="fixed right-0 hidden h-full w-1/2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white lg:block"
					aria-hidden="true"
				/>

				<main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
					<Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
					<h1 className="sr-only">Results</h1>

					<section
						aria-labelledby="results-heading"
						className="bg-gray-50 px-4 pt-24 pb-10 mt-10 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16">
						<div className="mx-auto max-w-lg lg:max-w-none">
							<h2
								id="summary-heading"
								className="text-lg font-medium text-gray-900 dark:text-white">
								Results
							</h2>
							<dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
								<div className="flex items-center justify-between">
									<dt className="text-gray-600 dark:text-white">Annual Business Revenue</dt>
									<dd className="text-gray-600 dark:text-white">${revenueAmount}</dd>
								</div>

								<div className="flex items-center justify-between">
									<dt className="text-gray-600 dark:text-white">Funding Amount</dt>
									<dd className="text-gray-600 dark:text-white">${fundingAmount}</dd>
								</div>

								<div className="flex items-center justify-between">
									<dt className="text-gray-600 dark:text-white">Fees</dt>
									<dd className="text-gray-600 dark:text-white">
										({feesData.percentage.toFixed(0)}% ) ${feesData.fees.toFixed(2)}
									</dd>
								</div>

								<div className="flex items-center justify-between border-t border-gray-200 pt-4">
									<dt className="text-base text-gray-600 dark:text-white">Total Revenue Share</dt>
									<dd className="text-base dark:text-white">${totalRevenueShare}</dd>
								</div>
								<div className="flex items-center justify-between pt-1">
									<dt className="text-base text-gray-600 dark:text-white">Expected transfers</dt>
									<dd className="dark:text-white text-base">{expectedTransfers}</dd>
								</div>
								<div className="flex items-center justify-between pt-1">
									<dt className="text-base text-gray-600 dark:text-white">
										Expected completion date
									</dt>
									<dd className=" dark:text-white text-base">
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
					<form className="px-4 pt-24 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
						<div className="mx-auto max-w-lg lg:max-w-none">
							<section aria-labelledby="contact-info-heading">
								<h2
									id="financing-options"
									className="text-lg font-medium text-gray-900 dark:text-white">
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
											className="block text-sm font-medium text-gray-700 dark:text-white">
											What is your desired loan amount?
										</label>
										<div className="mt-1">
											<RangeSlider
												min={parseFloat(fundingAmountMin)}
												max={parseFloat(fundingAmountMax)}
												step={5000}
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
										className="mt-1 block text-sm font-medium text-gray-700 dark:text-white">
										Revenue Share Percentage:
									</label>
									<div className="mb-4">
										<PercentageStat percentage={revenuePercentage} />
									</div>
								</div>

								<div className="mt-4 flex flex-row gap-4">
									<label
										htmlFor="revenue-shared-freq"
										className="block text-sm font-medium text-gray-700 dark:text-white">
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
										<label
											htmlFor="address"
											className="block text-sm font-medium text-gray-700 dark:text-white">
											Desired Payment Delays
										</label>
										<div className="mt-1">
											<ComboBoxComponent
												data={delayOptions}
												label=""
												onChange={(selectedValue) => handleDelayChange(selectedValue)}
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
