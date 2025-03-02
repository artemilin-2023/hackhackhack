import { useState } from 'react';
import { Button } from 'shared/ui/button';
import styles from './AuthForm.module.css';
import { useStore } from 'shared/store/store';
import { IRegisterProps } from "features/Auth/Auth.model"

type AuthMode = 'login' | 'register';

export const AuthForm = () => {
	const [mode, setMode] = useState<AuthMode>('login');
	const [formData, setFormData] = useState<IRegisterProps>({
		email: '',
		password: '',
		name: '',
	});

	const store = useStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// ahaha start
		if (mode === 'login') {
			store.login(formData.email, formData.password);
			setTimeout(() => {
				store.getMe();
				setTimeout(() => {
					store.getMe();
					setTimeout(() => {
						store.getMe();
					}, 600);
				}, 600);
			}, 600);
			
		} else {
			store.register(formData);
			setTimeout(() => {
				store.getMe();
				setTimeout(() => {
					store.getMe();
					setTimeout(() => {
						store.getMe();
					}, 600);
				}, 600);
			}, 600);
		}
		// ahaha end
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>
					{mode === 'login' ? 'С возвращением' : 'Создать аккаунт'}
				</h1>
				<p className={styles.subtitle}>
					{mode === 'login'
						? 'Введите свои данные для входа в аккаунт'
						: 'Зарегистрируйтесь, чтобы начать покупать и продавать цифровые товары'
					}
				</p>
			</div>

			<div className={styles.modeSwitch}>
				<button
					className={`${styles.modeButton} ${mode === 'login' ? styles.active : ''}`}
					onClick={() => setMode('login')}
				>
					Вход
				</button>
				<button
					className={`${styles.modeButton} ${mode === 'register' ? styles.active : ''}`}
					onClick={() => setMode('register')}
				>
					Регистрация
				</button>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				{mode === 'register' && (
					<div className={styles.formGroup}>
						<label htmlFor="name">Имя</label>
						<input
							type="text"
							id="name"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="Введите ваше имя"
							required
						/>
					</div>
				)}

				<div className={styles.formGroup}>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						value={formData.email}
						onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						placeholder="Введите ваш email"
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="password">Пароль</label>
					<input
						type="password"
						id="password"
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						placeholder="Введите ваш пароль"
						required
					/>
				</div>

				<Button type="submit" className={styles.submitButton}>
					{mode === 'login' ? 'Войти' : 'Создать аккаунт'}
				</Button>
			</form>
		</div>
	);
};
