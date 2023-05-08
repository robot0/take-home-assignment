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
		return storedFundUses ? JSON.parse(storedFundUses) : [];
	});

	const [newFundUse, setNewFundUse] = useState<FundUse>({
		id: Date.now(),
		fundUseOption: fundUseOptions[0]?.id || 0,
		description: "",
		amount: 0,
	});

	const addRow = () => {
		setFundUses((prevState) => [...prevState, newFundUse]);
		saveList();

		setNewFundUse({
			id: Date.now(),
			fundUseOption: fundUseOptions[0]?.id || 0,
			description: "",
			amount: 0,
		});
	};

	const updateNewFundUse = (field: keyof FundUse, value: any) => {
		setNewFundUse((prevState) => ({ ...prevState, [field]: value }));
	};

	const updateRow = (id: number, field: keyof FundUse, value: any) => {
		setFundUses((prevState) =>
			prevState.map((fundUse) => (fundUse.id === id ? { ...fundUse, [field]: value } : fundUse)),
		);
		saveList();
	};

	const deleteRow = (id: number) => {
		setFundUses((prevState) => {
			const updatedFundUses = prevState.filter((fundUse) => fundUse.id !== id);
			localStorage.setItem("fundUses", JSON.stringify(updatedFundUses));
			return updatedFundUses;
		});
		saveList();
	};

	const saveList = () => {
		// Save the list to local storage
		localStorage.setItem("fundUses", JSON.stringify(fundUses));
	};

	return (
		<section className="mt-4">
			<h2>What will you use the funds for?</h2>
			<ul className="relative">
				<li className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4 sm:grid-cols-4">
					<ComboBoxComponent
						data={fundUseOptions}
						label=""
						onChange={(selectedValue) => updateNewFundUse("fundUseOption", selectedValue?.id)}
					/>
					<InputBox
						type="text"
						label=""
						id="description"
						value={newFundUse.description}
						onChange={(e) => updateNewFundUse("description", e.target.value)}
						placeholder="Description"
					/>
					<InputBox
						type="number"
						label=""
						id="amount"
						value={newFundUse.amount}
						onChange={(e) => updateNewFundUse("amount", parseFloat(e.target.value))}
						placeholder="Amount"
					/>
				</li>
				{fundUses.map((fundUse, index) => (
					<li className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4 sm:grid-cols-4" key={fundUse.id}>
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
						<Button label="Delete" type="delete" onClick={() => deleteRow(fundUse.id)}></Button>
					</li>
				))}
			</ul>
			<Button label="Add" type="add" onClick={addRow}></Button>
		</section>
	);
};

export default FundUsesList;
