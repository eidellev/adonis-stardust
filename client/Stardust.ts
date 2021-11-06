import { match, parse } from '@poppinss/matchit';
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
  private reverseRoutes: Record<string, string> = {};
  private parsedRoutePatterns: any[];

  constructor(namedRoutes: Record<string, string>) {
    if (!namedRoutes) {
      console.error('Routes could not be found. Please make sure you use the `@routes()` tag in your view!');
      return;
    }

    const parsedRoutePatterns = Object.entries(namedRoutes).map(([, pattern]) => parse(pattern));

    this.routes = namedRoutes;
    this.reverseRoutes = Object.fromEntries(Object.entries(namedRoutes).map(([key, value]) => [value, key]));
    this.parsedRoutePatterns = parsedRoutePatterns;
  }

  /**
   * Returns all AdonisJS named routes
   * @example
   * ```typescript
   *  import { stardust } from '@eidellev/adonis-stardust';
   * ...
   *  stardust.getRoutes();
   * ```
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

  /**
   * Current route.
   * If the current route doesn't match any named routes, the returned value will be `null`
   * @example
   * ```typescript
   *  import { stardust } from '@eidellev/adonis-stardust';
   * ...
   *  stardust.current; // => 'users.index'
   * ```
   */
  public get current(): string | null {
    const { pathname } = new URL(this.location.href);
    const [matchedRoute] = match(pathname, this.parsedRoutePatterns);

    if (!matchedRoute) {
      return null;
    }

    const { old: pattern } = matchedRoute;
    return this.reverseRoutes[pattern];
  }

  private get location() {
    return (globalThis ?? window).location;
  }

  /**
   * Checks if a given route is the current route
   * @example
   * ```typescript
   * import { stardust } from '@eidellev/adonis-stardust';
   * ...
   * stardust.isCurrent('users.index'); // => true/false
   * ```
   */
  public isCurrent(route: string): boolean {
    return route === this.current;
  }
}
