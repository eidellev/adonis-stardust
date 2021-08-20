import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { RouterContract } from '@ioc:Adonis/Core/Route';
import { ViewContract } from '@ioc:Adonis/Core/View';

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
    return Object.entries(Route.toJSON())
      .map(([, routes]) => routes.map(({ name, pattern }) => [name, pattern]))
      .flat()
      .filter(([name]) => Boolean(name));
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
          out += template.sharedState.routes()
          `,
          token.filename,
          token.loc.start.line,
        );
      },
    });
  }

  private registerRoutesGlobal(View: ViewContract, namedRoutes) {
    View.global('routes', () => {
      return `
<script>
  window.stardust = { namedRoutes: ${JSON.stringify(namedRoutes)} };
</script>
      `;
    });
  }

  public async ready() {
    this.app.container.withBindings(['Adonis/Core/View', 'Adonis/Core/Route'], (View, Route) => {
      const namedRoutes = this.getNamedRoutes(Route);
      this.registerRoutesGlobal(View, namedRoutes);
      this.registerStardustTag(View);
    });
  }
}
