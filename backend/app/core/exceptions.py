from typing import Any, Dict, Optional


class BaseAppException(Exception):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class NotFoundException(BaseAppException):
    pass


class ValidationException(BaseAppException):
    pass


class ConstraintViolationException(BaseAppException):
    pass


class LLMServiceException(BaseAppException):
    pass


class LLMServiceUnavailableException(LLMServiceException):
    pass
