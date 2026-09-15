import logging
import os
import sys

from .handlers import create_file_handler


APP_LOGGER = "app"


def configure_logging():

    log_level_name = os.getenv(
        "LOG_LEVEL",
        "INFO",
    ).upper()

    log_level = getattr(
        logging,
        log_level_name,
        logging.INFO,
    )

    app_logger = logging.getLogger(APP_LOGGER)

    # Prevent duplicate handlers when Uvicorn reloads.
    if getattr(app_logger, "_configured", False):
        return

    app_logger.setLevel(log_level)
    app_logger.propagate = False

    # ---------------------------------------------------------
    # Console
    # ---------------------------------------------------------

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)

    from .formatters import JsonFormatter

    console_handler.setFormatter(JsonFormatter())

    # ---------------------------------------------------------
    # Application
    # ---------------------------------------------------------

    app_handler = create_file_handler(
        filename="app.log",
        level=logging.INFO,
    )

    # ---------------------------------------------------------
    # Errors
    # ---------------------------------------------------------

    error_handler = create_file_handler(
        filename="error.log",
        level=logging.ERROR,
    )

    # ---------------------------------------------------------
    # Payments
    # ---------------------------------------------------------

    payment_handler = create_file_handler(
        filename="payment.log",
        level=logging.INFO,
        logger_prefix="app.payment",
    )

    # ---------------------------------------------------------
    # Webhooks
    # ---------------------------------------------------------

    webhook_handler = create_file_handler(
        filename="webhook.log",
        level=logging.INFO,
        logger_prefix="app.webhook",
    )

    # ---------------------------------------------------------
    # System
    # ---------------------------------------------------------

    system_handler = create_file_handler(
        filename="system.log",
        level=logging.INFO,
        logger_prefix="app.system",
    )

    handlers = [
        console_handler,
        app_handler,
        error_handler,
        payment_handler,
        webhook_handler,
        system_handler,
    ]

    for handler in handlers:
        app_logger.addHandler(handler)

    app_logger._configured = True


def get_logger(name: str) -> logging.Logger:

    if not name.startswith("app"):
        name = f"app.{name}"

    return logging.getLogger(name)