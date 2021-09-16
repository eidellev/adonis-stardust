import { UrlBuilder } from './UrlBuilder';

/**
 * Options accepted by the route method
 */
interface RouteOptions {
  qs?: Record<string, any>;
  prefixUrl?: string;
}

export class Stardust {
  private routes: Record<string, string> = {};

  constructor(namedRoutes: Record<string, string>) {
    if (!namedRoutes) {
      console.error('Routes could not be found. Please make sure you use the `@routes()` tag in your view!');
      return;
    }

    this.routes = namedRoutes;
  }

  /**
   * Returns all AdonisJS named routes
   */
  public getRoutes() {
    return this.routes;
  }

  /**
   * Get URL builder instance to make the URL
   * @returns Instance of URL builder
   */
  public builder() {
    return new UrlBuilder(this.routes);
  }

  /**
   * Resolve Adonis route
   * @param route Route name
   * @param params Route path params
   * @param options Make url options
   * @returns Full path with params
   */
  public route(route: string, params?: any[] | Record<string, any>, options?: RouteOptions): string {
    return new UrlBuilder(this.routes).params(params).qs(options?.qs).prefixUrl(options?.prefixUrl).make(route);
  }
}

export let stardust: Stardust;

/**
 * Initialize stardust
 */
export function initRoutes() {
  const { namedRoutes } = window.stardust;
  stardust = new Stardust(namedRoutes);
}
