import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

interface Option {
	id: number;
	name: string;
}

interface ComboBoxProps {
	data: Option[];
	label: string;
	onChange: (selectedOption: Option | null) => void;
}

function classNames(...classes: (string | boolean | undefined)[]): string {
	return classes.filter(Boolean).join(" ");
}

export default function ComboBoxComponent({ data, label, onChange }: ComboBoxProps) {
	const [query, setQuery] = useState("");
	const [selectedOption, setSelectedOption] = useState<Option | null>(null);

	const handleChange = (option: Option | null) => {
		setSelectedOption(option);
		onChange(option);
	};
	const filteredOptions =
		query === ""
			? data
			: data.filter((option) => {
					return option.name.toLowerCase().includes(query.toLowerCase());
			  });

	return (
		<Combobox as="div" value={selectedOption} onChange={handleChange}>
			<Combobox.Label className="block text-sm font-medium text-gray-700">{label}</Combobox.Label>
			<div className="relative mt-1">
				<Combobox.Input
					className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
					onChange={(event) => setQuery(event.target.value)}
					displayValue={(option: Option) => option?.name}
				/>
				<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
					<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</Combobox.Button>

				{filteredOptions.length > 0 && (
					<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredOptions.map((option) => (
							<Combobox.Option
								key={option.id}
								value={option}
								className={({ active }) =>
									classNames(
										"relative cursor-default select-none py-2 pl-3 pr-9",
										active ? "bg-indigo-600 text-white" : "text-gray-900",
									)
								}>
								{({ active, selected }) => (
									<>
										<span className={classNames("block truncate", selected && "font-semibold")}>
											{option.name}
										</span>

										{selected && (
											<span
												className={classNames(
													"absolute inset-y-0 right-0 flex items-center pr-4",
													active ? "text-white" : "text-indigo-600",
												)}>
												<CheckIcon className="h-5 w-5" aria-hidden="true" />
											</span>
										)}
									</>
								)}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</div>
		</Combobox>
	);
}