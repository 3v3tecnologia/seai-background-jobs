export class ExternalServiceError extends Error {
  constructor(serviceName) {
    super(`Falha ao se comunicar com api de ${serviceName}`);
    this.name = "InternalServiceError";
  }
}
