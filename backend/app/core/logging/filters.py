import logging


class LoggerNameFilter(logging.Filter):

    def __init__(self, prefix: str):
        super().__init__()
        self.prefix = prefix

    def filter(self, record: logging.LogRecord) -> bool:
        return record.name.startswith(self.prefix)