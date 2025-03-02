import asyncio
import os
from common.logger import log
from application.services.ftp_client_service import FTPClientService
from typing import Optional

class FTPClientScheduler:
    def __init__(self, ftp_client: FTPClientService):
        self.interval_hours = int(os.getenv("FTP_UPDATE_INTERVAL_HOURS", "24"))  # Интервал в часах
        self.is_running = False
        self.task: Optional[asyncio.Task] = None
        self.ftp_client = ftp_client

    async def start(self):
        if self.is_running:
            log.warning("FTP client scheduler уже запущен")
            return

        self.is_running = True
        self.task = asyncio.create_task(self._download_files_periodically())
        log.info(f"FTP client scheduler стартовал с интервалом в {self.interval_hours} часов/часа")

    async def stop(self):
        if not self.is_running:
            log.warning("FTP client scheduler не запустился")
            return

        self.is_running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
            self.task = None
        log.info("FTP client scheduler остановлен")

    async def _download_files_periodically(self):
        while self.is_running:
            try:
                log.info("Запуск задачи: загрузка файлов с FTP-сервера")
                self.ftp_client.download_files()
                log.info("Задача завершена. Ожидание следующего запуска.")
            except Exception as e:
                log.error(f"Ошибка при загрузке файлов с FTP: {e}")

            await asyncio.sleep(self.interval_hours * 3600)  # Интервал в секундах