/**
 * Copy of https://github.com/adonisjs/http-server/blob/develop/src/Router/LookupStore.ts#L26
 * with a few modifications like remove the `makeSigned` method.
 */
export class UrlBuilder {
  /**
   * Params to be used for building the URL
   */
  private routeParams: any[] | Record<string, any>;

  /**
   * A custom query string to append to the URL
   */
  private queryString: Record<string, any> = {};

  /**
   * BaseURL to prefix to the endpoint
   */
  private baseUrl: string;

  constructor(private routes: Record<string, any>) {}

  /**
   * Processes the pattern with the route params
   */
  private processPattern(pattern: string): string {
    let url: string[] = [];
    const isParamsAnArray = Array.isArray(this.routeParams);

    /*
     * Split pattern when route has dynamic segments
     */
    const tokens = pattern.split('/');
    let paramsIndex = 0;

    for (const token of tokens) {
      /**
       * Expected wildcard param to be at the end always and hence
       * we must break out from the loop
       */
      if (token === '*') {
        const wildcardParams = isParamsAnArray ? this.routeParams.slice(paramsIndex) : this.routeParams['*'];
        if (!Array.isArray(wildcardParams)) {
          throw new Error('Wildcard param must pass an array of values');
        }

        if (!wildcardParams.length) {
          throw new Error(`Wildcard param is required to make URL for "${pattern}" route`);
        }

        url = url.concat(wildcardParams);
        break;
      }

      /**
       * Token is a static value
       */
      if (!token.startsWith(':')) {
        url.push(token);
      } else {
        const isOptional = token.endsWith('?');
        const paramName = token.replace(/^:/, '').replace(/\?$/, '');
        const param = isParamsAnArray ? this.routeParams[paramsIndex] : this.routeParams[paramName];

        paramsIndex++;

        /*
         * A required param is always required to make the complete URL
         */
        if (!param && !isOptional) {
          throw new Error(`"${param}" param is required to make URL for "${pattern}" route`);
        }

        url.push(param);
      }
    }

    return url.join('/');
  }

  /**
   * Finds the route inside the list of registered routes and
   * raises exception when unable to
   */
  private findRouteOrFail(identifier: string) {
    const route = this.routes[identifier];
    if (!route) {
      throw new Error(`Cannot find route for "${identifier}"`);
    }

    return route;
  }

  /**
   * Suffix the query string to the URL
   */
  private suffixQueryString(url: string): string {
    if (this.queryString) {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(this.queryString)) {
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, item));
        } else {
          params.set(key, value);
        }
      }

      const encoded = params.toString();
      url = encoded ? `${url}?${encoded}` : url;
    }

    return url;
  }

  /**
   * Prefix a custom url to the final URI
   */
  public prefixUrl(url?: string): this {
    if (url) {
      this.baseUrl = url;
    }
    return this;
  }

  /**
   * Append query string to the final URI
   */
  public qs(queryString?: Record<string, any>): this {
    if (queryString) {
      this.queryString = queryString;
    }
    return this;
  }

  /**
   * Define required params to resolve the route
   */
  public params(params?: any[] | Record<string, any>): this {
    if (params) {
      this.routeParams = params;
    }
    return this;
  }

  /**
   * Generate url for the given route identifier
   */
  public make(identifier: string) {
    const route = this.findRouteOrFail(identifier);
    const url = this.processPattern(route);
    return this.suffixQueryString(this.baseUrl ? `${this.baseUrl}${url}` : url);
  }
}
