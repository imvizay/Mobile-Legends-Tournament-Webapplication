class AppException(Exception):
    pass


class UserAlreadyExistsError(AppException):
    pass

class PendingRegistrationExistsError(AppException):
    pass