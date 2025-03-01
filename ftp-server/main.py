from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer
from decouple import config
import os
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

FTP_USER = config("FTP_USER", default="username")
FTP_PASSWORD = config("FTP_PASSWORD", default="password")
FTP_PORT = config("FTP_PORT", default=21, cast=int)
FTP_DIR = config("FTP_DIR", default=os.path.join(os.getcwd(), "files"))
PASV_MIN_PORT = config("PASV_MIN_PORT", default=60000, cast=int)
PASV_MAX_PORT = config("PASV_MAX_PORT", default=60100, cast=int)

if not os.path.exists(FTP_DIR):
    os.makedirs(FTP_DIR)
    logging.info(f"Создана папка: {FTP_DIR}")

authorizer = DummyAuthorizer()
authorizer.add_user(FTP_USER, FTP_PASSWORD, FTP_DIR, perm="elradfmw")

handler = FTPHandler
handler.authorizer = authorizer

handler.passive_ports = range(PASV_MIN_PORT, PASV_MAX_PORT + 1)

server = FTPServer(("0.0.0.0", FTP_PORT), handler)
logging.info(f"FTP-сервер запущен на 0.0.0.0:{FTP_PORT}, папка: {FTP_DIR}")
logging.info(f"Пассивный режим использует порты: {PASV_MIN_PORT}-{PASV_MAX_PORT}")
server.serve_forever()
