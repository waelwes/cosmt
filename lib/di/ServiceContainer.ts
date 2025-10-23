import { ServiceFactory } from './ServiceFactory';
import { IServiceFactory } from './interfaces/IServiceFactory';

/**
 * Service Container for dependency injection
 * Implements the Singleton pattern to ensure only one instance exists
 */
export class ServiceContainer {
  private static instance: ServiceContainer;
  private serviceFactory: IServiceFactory;

  private constructor() {
    this.serviceFactory = new ServiceFactory();
  }

  /**
   * Get the singleton instance of ServiceContainer
   * @returns The ServiceContainer instance
   */
  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Get the service factory
   * @returns The ServiceFactory instance
   */
  public getServiceFactory(): IServiceFactory {
    return this.serviceFactory;
  }
}
