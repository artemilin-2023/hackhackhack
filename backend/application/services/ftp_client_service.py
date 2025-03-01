import os
from ftplib import FTP
from io import StringIO, BytesIO
import csv
from common.logger import log
from application.services.lot_service import LotService


class FTPClientService:
    def __init__(self, lot_service: LotService):
        self.lot_service = lot_service
        self.ftp_host = os.getenv("FTP_HOST", "localhost")
        self.ftp_port = int(os.getenv("FTP_PORT", 21))
        self.ftp_user = os.getenv("FTP_USER", "admin")
        self.ftp_password = os.getenv("FTP_PASSWORD", "asd")
        self.ftp_directory = os.getenv("FTP_DIR", "./files")

    def download_files(self):
        try:
            ftp = FTP()
            ftp.connect(self.ftp_host, self.ftp_port)
            ftp.login(self.ftp_user, self.ftp_password)
            ftp.cwd(self.ftp_directory)

            files = ftp.nlst()
            log.info(f"Найдены файлы на FTP: {files}")

            for filename in files:
                if filename.endswith(".csv"):
                    log.info(f"Обработка файла: {filename}")

                    file_data = BytesIO()
                    ftp.retrbinary(f"RETR {filename}", file_data.write)
                    file_data.seek(0)

                    csv_content = file_data.getvalue().decode('utf-8')
                    csv_reader = csv.DictReader(StringIO(csv_content))

                    result = self.lot_service._upload_from_csv(csv_reader)
                    log.info(f"Результат обработки файла {filename}: {result}")

                    ftp.delete(filename)
                    log.info(f"Файл {filename} обработан и удалён с FTP-сервера.")

            ftp.quit()
        except Exception as e:
            log.error(f"Ошибка при работе с FTP: {e}")
