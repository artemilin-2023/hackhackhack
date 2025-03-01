import asyncio
import os
import datetime
from typing import Optional
from sqlmodel import Session, select
from domain.lot import Lot, LotStatus
from infrastructure.database import engine
from common.logger import log

class LotExpirationChecker:
    def __init__(self):
        self.interval_minutes = int(os.getenv("LOT_EXPIRATION_CHECK_INTERVAL_MINUTES", "60"))
        self.is_running = False
        self.task: Optional[asyncio.Task] = None

    async def start(self):
        if self.is_running:
            log.warning("Lot expiration checker is already running")
            return

        self.is_running = True
        self.task = asyncio.create_task(self._check_expired_lots_periodically())
        log.info(f"Lot expiration checker started with interval {self.interval_minutes} minutes")

    async def stop(self):
        if not self.is_running:
            log.warning("Lot expiration checker is not running")
            return

        self.is_running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
            self.task = None
        log.info("Lot expiration checker stopped")

    async def _check_expired_lots_periodically(self):
        while self.is_running:
            try:
                await self._update_expired_lots()
            except Exception as e:
                log.error(f"Error updating expired lots: {str(e)}")

            await asyncio.sleep(self.interval_minutes * 60)

    async def _update_expired_lots(self):
        today = datetime.datetime.now(datetime.UTC)
        
        with Session(engine) as session:
            query = select(Lot).where(
                Lot.status == LotStatus.CONFIRMED,
                Lot.lot_expiration_date < today
            )
            
            expired_lots = session.exec(query).all()
            
            if not expired_lots:
                log.info("No expired lots found")
                return
            
            for lot in expired_lots:
                lot.status = LotStatus.INACTIVE
                session.add(lot)
            
            session.commit()
            log.info(f"Updated {len(expired_lots)} expired lots to INACTIVE status")

lot_expiration_checker = LotExpirationChecker() 