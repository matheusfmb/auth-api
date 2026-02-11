type ServiceFactory<T = any> = () => T
type ServiceToken = string | Symbol

class DIContainer {
  private static services: Map<ServiceToken, ServiceFactory> = new Map()
  private static singletons: Map<ServiceToken, any> = new Map()

  static register<T>(token: ServiceToken, factory: ServiceFactory<T>): void {
    if (this.services.has(token)) {
      console.warn(`[DIContainer] Serviço ${String(token)} já foi registrado. Sobrescrevendo...`)
    }
    this.services.set(token, factory)
  }

  static registerSingleton<T>(token: ServiceToken, factory: ServiceFactory<T>): void {
    if (this.singletons.has(token)) {
      console.warn(`[DIContainer] Singleton ${String(token)} já foi registrado. Sobrescrevendo...`)
    }
    const instance = factory()
    this.singletons.set(token, instance)
    this.services.set(token, () => instance)
  }


  static get<T = any>(token: ServiceToken): T {
    const factory = this.services.get(token)
    
    if (!factory) {
      throw new Error(`[DIContainer] Serviço ${String(token)} não foi registrado. Registre-o em DIBootstrap.`)
    }

    return factory() as T
  }

  static has(token: ServiceToken): boolean {
    return this.services.has(token)
  }

  static clear(): void {
    this.services.clear()
    this.singletons.clear()
  }

  static debug(): void {
    console.log(`Total de serviços registrados: ${this.services.size}`)
    console.log(`Singletons em memória: ${this.singletons.size}`)
  }
}

export { DIContainer, ServiceToken, ServiceFactory }
