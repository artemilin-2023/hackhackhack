import { Button } from 'shared/ui/button';
import { HiTag, HiScale, HiCalendar } from "react-icons/hi";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import styles from './LotsSorting.module.css';

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
}

export const LotsSorting = ({ 
    currentSort, 
    isDescending, 
    onSortChange, 
    onDirectionChange 
}: LotsSortingProps) => {
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