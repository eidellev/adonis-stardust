class Stardust {
  private routes: Map<string, string>;

  constructor() {
    // TODO: Add global types
    // @ts-ignore
    const { namedRoutes } = window.stardust;

    if (!namedRoutes) {
      console.error('Routes could not be found. Please make sure you use the `@routes()` tag in your view!');
      return;
    }

    this.routes = new Map(namedRoutes);
  }

  public getRoutes() {
    return this.routes;
  }

  private resolveParams(path: string, params: Record<string, any>): string {
    let finalPath = path;
    console.log(finalPath);
    Object.entries(params).forEach(([key, value]) => {
      console.log({ key, value });
      finalPath = finalPath.replace(`:${key}`, value);
      console.log(finalPath);
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

export const routes = new Stardust();
