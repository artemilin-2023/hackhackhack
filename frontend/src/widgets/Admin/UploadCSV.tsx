import { useRef, useState } from 'react';
import { Button } from 'shared/ui/button';
import { useStore } from 'shared/store/store';
import styles from './UploadCSV.module.css';

export const UploadCSV = () => {
	const [isDragging, setIsDragging] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const store = useStore();

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		
		const file = e.dataTransfer.files[0];
		if (file && file.type === 'text/csv') {
			setSelectedFile(file);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		if (selectedFile) {
			try {
				await store.uploadCSV(selectedFile);
				setSelectedFile(null);
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
			} catch (error) {
				console.error('Error uploading CSV:', error);
			}
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Загрузить CSV файл</h1>
				<p className={styles.subtitle}>
					Загрузите CSV файл с данными о товарах
				</p>
			</div>

			<div
				className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current?.click()}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept=".csv"
					onChange={handleFileSelect}
					className={styles.fileInput}
				/>
				<div className={styles.dropzoneContent}>
					{selectedFile ? (
						<p>Выбран файл: {selectedFile.name}</p>
					) : (
						<>
							<p>Перетащите CSV файл сюда или кликните для выбора</p>
							<p className={styles.dropzoneHint}>Поддерживаются только CSV файлы</p>
						</>
					)}
				</div>
			</div>

			<Button
				onClick={handleUpload}
				disabled={!selectedFile}
				className={styles.uploadButton}
			>
				Загрузить файл
			</Button>
		</div>
	);
};
