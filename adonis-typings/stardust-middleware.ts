declare module '@ioc:EidelLev/Stardust/Middleware' {
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

  export default class StardustMiddleware {
    public handle(ctx: HttpContextContract, next: () => Promise<void>);
  }
}
