import { useState } from 'react';
import { Button } from 'shared/ui/button';
import { useStore } from 'shared/store/store';
import { ICreateLotProps } from 'features/Lots/Lots.model';
import styles from './CreateLotForm.module.css';

export const CreateLotForm = () => {
	const [formData, setFormData] = useState<ICreateLotProps>({
		title: '',
		description: '',
		price: 0,
	});

	const store = useStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await store.createOne(formData);
		setFormData({
			title: '',
			description: '',
			price: 0,
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Создать новый лот</h1>
				<p className={styles.subtitle}>
					Заполните информацию о вашем товаре
				</p>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.formGroup}>
					<label htmlFor="title">Название</label>
					<input
						type="text"
						id="title"
						value={formData.title}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						placeholder="Введите название товара"
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="description">Описание</label>
					<textarea
						id="description"
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						placeholder="Введите описание товара"
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="price">Цена</label>
					<input
						type="number"
						id="price"
						value={formData.price}
						onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
						placeholder="Введите цену"
						min="0"
						required
					/>
				</div>

				<Button type="submit" className={styles.submitButton}>
					Создать лот
				</Button>
			</form>
		</div>
	);
};
