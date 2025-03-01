import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from 'shared/ui/button';
import { HiTag, HiScale, HiCalendar, HiSearch, HiFilter, HiX } from "react-icons/hi";
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

const oilTypes = [
	"АИ-92", 
	"АИ-95", 
	"АИ-92 Экто", 
	"АИ-95 Экто", 
	"ДТ"
];

interface LotsSortingProps {
	currentSort: string;
	isDescending: boolean;
	onSortChange: (sort: string) => void;
	onDirectionChange: () => void;
	onSearch: (query: string) => void;
	selectedOilType?: string;
	onOilTypeChange: (oilType: string | undefined) => void;
	selectedPumpName?: string;
	onPumpNameChange: (pumpName: string | undefined) => void;
	pumpNames: string[];
}

export const LotsSorting = ({
	currentSort,
	isDescending,
	onSortChange,
	onDirectionChange,
	onSearch,
	selectedOilType,
	onOilTypeChange,
	selectedPumpName,
	onPumpNameChange,
	pumpNames
}: LotsSortingProps) => {
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);
	
	const debouncedSearch = useCallback(
		debounce((query: string) => {
			onSearch(query);
		}, 1000),
		[onSearch]
	);
	

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		debouncedSearch(value);
	};


	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
				setIsFilterOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSelectOilType = (type: string | undefined) => {
		onOilTypeChange(type);
	};

	const handleSelectPumpName = (name: string | undefined) => {
		onPumpNameChange(name);
	};

	const handleResetFilters = () => {
		onOilTypeChange(undefined);
		onPumpNameChange(undefined);
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
			
			<div className={styles.filterContainer} ref={filterRef}>
				<Button 
					variant="outline" 
					className={styles.filterButton}
					onClick={() => setIsFilterOpen(!isFilterOpen)}
				>
					<HiFilter className={styles.buttonIcon} />
					Фильтры
					{(selectedOilType || selectedPumpName) && (
						<span className={styles.filterBadge}>
							{(selectedOilType && selectedPumpName) ? '2' : '1'}
						</span>
					)}
				</Button>
				
				{isFilterOpen && (
					<div className={styles.filterPopover}>
						<div className={styles.filterHeader}>
							<h3>Фильтры</h3>
							{(selectedOilType || selectedPumpName) && (
								<Button 
									variant="outline" 
									className={styles.resetButton}
									onClick={handleResetFilters}
								>
									Сбросить
								</Button>
							)}
							<button 
								className={styles.closeButton}
								onClick={() => setIsFilterOpen(false)}
							>
								<HiX />
							</button>
						</div>
						
						<div className={styles.filterSection}>
							<h4 className={styles.filterTitle}>Тип топлива</h4>
							<div className={styles.filterOptions}>
								<div 
									className={`${styles.filterOption} ${!selectedOilType ? styles.selected : ''}`}
									onClick={() => handleSelectOilType(undefined)}
								>
									Все типы
								</div>
								{oilTypes.map(type => (
									<div 
										key={type} 
										className={`${styles.filterOption} ${selectedOilType === type ? styles.selected : ''}`}
										onClick={() => handleSelectOilType(type)}
									>
										{type}
									</div>
								))}
							</div>
						</div>
						
						<div className={styles.filterSection}>
							<h4 className={styles.filterTitle}>Нефтебаза</h4>
							<div className={styles.filterOptions}>
								<div 
									className={`${styles.filterOption} ${!selectedPumpName ? styles.selected : ''}`}
									onClick={() => handleSelectPumpName(undefined)}
								>
									Все нефтебазы
								</div>
								{pumpNames.map(name => (
									<div 
										key={name} 
										className={`${styles.filterOption} ${selectedPumpName === name ? styles.selected : ''}`}
										onClick={() => handleSelectPumpName(name)}
									>
										{name}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
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
