import logging
import os

from dotenv import load_dotenv

load_dotenv()

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=LOG_LEVEL)

log = logging.getLogger()
log.info("LOG LEVEL: %s", LOG_LEVEL)
