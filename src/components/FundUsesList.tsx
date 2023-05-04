import { useState } from "react";
import ComboBoxComponent from "./ComboBox";
import InputBox from "./InputBox";
import Button from "./Button";

interface FundUse {
	id: number;
	fundUseOption: number;
	description: string;
	amount: number;
}

interface FundUseListProps {
	fundUseOptions: { id: number; name: string }[];
}

const FundUsesList: React.FC<FundUseListProps> = ({ fundUseOptions }) => {
	const [fundUses, setFundUses] = useState<FundUse[]>(() => {
		const storedFundUses = localStorage.getItem("fundUses");
		return storedFundUses
			? JSON.parse(storedFundUses)
			: [
					{
						id: Date.now(),
						fundUseOption: fundUseOptions[0]?.id || 0,
						description: "",
						amount: 0,
					},
			  ];
	});

	const addRow = () => {
		// Call the saveList function to save the list before adding a new row
		saveList();

		setFundUses((prevState) => [
			...prevState,
			{
				id: Date.now(),
				fundUseOption: fundUseOptions[0].id,
				description: "",
				amount: 0,
			},
		]);
	};

	const updateRow = (id: number, field: keyof FundUse, value: any) => {
		setFundUses((prevState) =>
			prevState.map((fundUse) => (fundUse.id === id ? { ...fundUse, [field]: value } : fundUse)),
		);
	};

	const deleteRow = (id: number) => {
		setFundUses((prevState) => {
			const updatedFundUses = prevState.filter((fundUse) => fundUse.id !== id);
			localStorage.setItem("fundUses", JSON.stringify(updatedFundUses));
			return updatedFundUses;
		});
	};

	const saveList = () => {
		// Save the list to local storage
		localStorage.setItem("fundUses", JSON.stringify(fundUses));
	};

	return (
		<section className="mt-4">
			<h2>What will you use the funds for?</h2>
			<div className="relative">
				{fundUses.map((fundUse, index) => (
					<div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4 sm:grid-cols-4" key={fundUse.id}>
						<ComboBoxComponent
							data={fundUseOptions}
							label=""
							onChange={(selectedValue) => updateRow(fundUse.id, "fundUseOption", selectedValue)}
						/>
						<InputBox
							type="text"
							label=""
							id="description"
							value={fundUse.description}
							onChange={(e) => updateRow(fundUse.id, "description", e.target.value)}
							placeholder="Description"
						/>
						<InputBox
							type="number"
							label=""
							id="amount"
							value={fundUse.amount}
							onChange={(e) => updateRow(fundUse.id, "amount", parseFloat(e.target.value))}
							placeholder="Amount"
						/>
						{index === 0 ? (
							<Button label="Add" type="add" onClick={addRow}></Button>
						) : (
							<Button label="Delete" type="add" onClick={() => deleteRow(fundUse.id)}></Button>
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default FundUsesList;
