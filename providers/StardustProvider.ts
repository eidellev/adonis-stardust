import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { RouterContract } from '@ioc:Adonis/Core/Route';
import { ViewContract } from '@ioc:Adonis/Core/View';
import StardustMiddleware from '../middleware/Stardust';

type RoutesManifest = Record<string, { pattern: string; methods: string[] }>;

/*
|--------------------------------------------------------------------------
| Stardust Provider
|--------------------------------------------------------------------------
*/
export default class StardustProvider {
  constructor(protected app: ApplicationContract) {}
  public static needsApplication = true;

  /**
   * Returns list of named routes
   */
  private getNamedRoutes(Route: RouterContract) {
    /**
     * Only sharing the main domain routes. Subdomains are
     * ignored for now. Let's see if many people need it
     */
    const mainDomainRoutes = Route.toJSON()?.['root'] ?? [];

    return mainDomainRoutes.reduce<RoutesManifest>((routes, route) => {
      if (route.name) {
        routes[route.name] = {
          pattern: route.pattern,
          methods: route.methods,
        };
      } else if (typeof route.handler === 'string') {
        routes[route.handler] = {
          pattern: route.pattern,
          methods: route.methods,
        };
      }

      return routes;
    }, {});
  }

  /**
   * Register the `@routes()` tag
   */
  private registerStardustTag(View: ViewContract) {
    View.registerTag({
      block: false,
      tagName: 'routes',
      seekable: false,
      compile(_, buffer, token) {
        buffer.writeExpression(
          `\n
          out += template.sharedState.routes(template.sharedState.cspNonce)
          `,
          token.filename,
          token.loc.start.line,
        );
      },
    });
  }

  private registerRoutesGlobal(View: ViewContract, namedRoutes: RoutesManifest) {
    View.global('routes', (cspNonce?: string) => {
      return `
<script${cspNonce ? ` nonce="${cspNonce}"` : ''}>
  (globalThis || window).stardust = {namedRoutes: ${JSON.stringify(namedRoutes)}};
</script>
      `;
    });
  }

  /**
   * Registers named routes on the global scope in order to seamlessly support
   * stardust's functionality on the server
   * @param namedRoutes
   */
  private registerSsrRoutes(namedRoutes: RoutesManifest) {
    globalThis.stardust = { namedRoutes };
  }

  public ready() {
    this.app.container.bind('EidelLev/Stardust/Middleware', () => StardustMiddleware);

    this.app.container.withBindings(['Adonis/Core/View', 'Adonis/Core/Route'], (View, Route) => {
      const namedRoutes = this.getNamedRoutes(Route);

      this.registerRoutesGlobal(View, namedRoutes);
      this.registerStardustTag(View);
      this.registerSsrRoutes(namedRoutes);
    });
  }
}
