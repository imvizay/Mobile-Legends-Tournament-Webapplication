import logging
import os

from logging.handlers import RotatingFileHandler

from .filters import LoggerNameFilter
from .formatters import JsonFormatter


BASE_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../../",
    )
)

LOG_DIR = os.path.join(BASE_DIR, "logs")


MAX_BYTES = 10 * 1024 * 1024
BACKUP_COUNT = 5


def ensure_log_directory():
    os.makedirs(LOG_DIR, exist_ok=True)


def create_file_handler(
    filename: str,
    level: int,
    logger_prefix: str | None = None,
):
    ensure_log_directory()

    path = os.path.join(LOG_DIR, filename)

    handler = RotatingFileHandler(
        path,
        maxBytes=MAX_BYTES,
        backupCount=BACKUP_COUNT,
        encoding="utf-8",
    )

    handler.setLevel(level)
    handler.setFormatter(JsonFormatter())

    if logger_prefix:
        handler.addFilter(
            LoggerNameFilter(logger_prefix)
        )

    return handler