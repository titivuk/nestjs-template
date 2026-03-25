export class ValidationException extends Error {
  errors: Array<{
    field: string;
    message: string;
  }> = [];
}
