declare global {
  interface Window {
    stardust: { namedRoutes: [string, string][] };
  }
}

class Stardust {
  private routes: Map<string, string>;

  constructor(namedRoutes: [string, string][]) {
    if (!namedRoutes) {
      console.error('Routes could not be found. Please make sure you use the `@routes()` tag in your view!');
      return;
    }

    this.routes = new Map(namedRoutes);
  }

  /**
   * Returns all adonis named routes
   */
  public getRoutes() {
    return this.routes;
  }

  private resolveParams(path: string, params: Record<string, any>): string {
    let finalPath = path;

    Object.entries(params).forEach(([key, value]) => {
      finalPath = finalPath.replace(`:${key}`, value);
    });

    return finalPath;
  }

  /**
   * Resolve Adonis route
   * @param route Route name
   * @param params Route path params
   * @returns Full path with params
   */
  public route(route: string, params: Record<string, any> = {}): string {
    const path = this.routes.get(route);

    if (!path) {
      console.error(`Route '${route}' could not resolved!`);
      return '';
    }

    return this.resolveParams(path, params);
  }
}

export let routes: Stardust;

/**
 * Initialize stardust
 */
export function initRoutes() {
  const { namedRoutes } = window.stardust;
  routes = new Stardust(namedRoutes);
}
