import { ApplicationContract } from '@ioc:Adonis/Core/Application';

/*
|--------------------------------------------------------------------------
| Stardust Provider
|--------------------------------------------------------------------------
*/
export default class StardustProvider {
  constructor(protected app: ApplicationContract) {}
  public static needsApplication = true;

  public async ready() {
    this.app.container.withBindings(['Adonis/Core/Route'], (Route) => {
      const namedRoutes = Object.entries(Route.toJSON())
        .map(([, routes]) =>
          routes.map((route) => ({
            name: route.name,
            pattern: route.pattern,
          })),
        )
        .flat()
        .filter(({ name }) => Boolean(name));

      console.log({ namedRoutes });
    });
  }
}
