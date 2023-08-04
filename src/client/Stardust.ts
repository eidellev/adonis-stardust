import { match, parse } from '@poppinss/matchit';
import { UrlBuilder } from './UrlBuilder';

/**
 * Options accepted by the route method
 */
interface RouteOptions {
  qs?: Record<string, any>;
  prefixUrl?: string;
}

type NamedRoutes = Record<string, { pattern: string; methods: string[] }>;
type PatternRoutes = Record<string, { name: string; methods: string[] }[]>;

export class Stardust {
  private routes: NamedRoutes = {};
  private reverseRoutes: PatternRoutes = {};
  private parsedRoutePatterns: any[];

  constructor(namedRoutes: NamedRoutes) {
    if (!namedRoutes) {
      throw new Error('Routes could not be found. Please make sure you use the `@routes()` tag in your view!');
    }

    const parsedRoutePatterns = Object.values(namedRoutes).map(({ pattern }) => parse(pattern));

    this.routes = namedRoutes;
    this.reverseRoutes = Object.entries(namedRoutes).reduce<PatternRoutes>((routes, [name, { pattern, methods }]) => {
      if (!routes[pattern]) {
        routes[pattern] = [];
      }

      routes[pattern].push({ name, methods });

      return routes;
    }, {});
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
    const [matchedRoute] = match(this.pathname, this.parsedRoutePatterns);

    const pattern = matchedRoute?.old ?? null;

    return this.reverseRoutes[pattern]?.find(({ methods }) => methods.includes('GET'))?.name ?? null;
  }

  private get pathname() {
    /**
     * When rendering on the server
     */
    if (globalThis.stardust?.pathname) {
      return globalThis.stardust.pathname;
    }

    const { pathname } = new URL((window ?? globalThis).location.href);
    return pathname;
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
