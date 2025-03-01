import { useState, useCallback } from "react"
import { Button } from 'shared/ui/button';
import { HiTag, HiScale, HiCalendar, HiSearch } from "react-icons/hi";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import styles from './LotsSorting.module.css';
import { debounce } from "shared/lib/debounce";

interface SortOption {
	label: string;
	value: string;
	icon: React.ReactNode;
}

const sortOptions: SortOption[] = [
	{
		label: 'По цене',
		value: 'price_per_ton',
		icon: <HiTag className={styles.buttonIcon} />
	},
	{
		label: 'По весу',
		value: 'available_weight',
		icon: <HiScale className={styles.buttonIcon} />
	},
	{
		label: 'По дате',
		value: 'lot_expiration_date',
		icon: <HiCalendar className={styles.buttonIcon} />
	},
];

interface LotsSortingProps {
	currentSort: string;
	isDescending: boolean;
	onSortChange: (sort: string) => void;
	onDirectionChange: () => void;
	onSearch: (query: string) => void;
}

export const LotsSorting = ({
	currentSort,
	isDescending,
	onSortChange,
	onDirectionChange,
	onSearch
}: LotsSortingProps) => {
	const [searchQuery, setSearchQuery] = useState<string>("")
	
	// Создаем стабильную функцию дебаунса с useCallback
	const debouncedSearch = useCallback(
		debounce((query: string) => {
			onSearch(query);
		}, 1000),
		[onSearch]
	);
	
	// Обработчик изменения поля ввода
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		debouncedSearch(value);
	};

	return (
		<div className={styles.container}>
			<div className={styles.sortButtons}>
				{sortOptions.map((option) => (
					<Button
						key={option.value}
						variant={currentSort === option.value ? 'primary' : 'outline'}
						onClick={() => onSortChange(option.value)}
						className={styles.sortButton}
					>
						{option.icon}
						{option.label}
					</Button>
				))}
			</div>
			<div className={styles.formGroup}>
				<div className={styles.searchInputWrapper}>
					<HiSearch className={styles.searchIcon} />
					<input
						type="text"
						id="search"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Поиск"
						className={styles.searchInput}
					/>
				</div>
			</div>
			<Button
				variant="secondary"
				onClick={onDirectionChange}
				className={styles.directionButton}
			>
				{isDescending ? <HiArrowDown className={styles.buttonIcon} /> : <HiArrowUp className={styles.buttonIcon} />}
				{isDescending ? 'По убыванию' : 'По возрастанию'}
			</Button>
		</div>
	);
}; 
