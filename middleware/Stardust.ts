import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class StardustMiddleware {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const { pathname } = new URL(request.completeUrl());

    globalThis.stardust = {
      ...globalThis.stardust,
      pathname,
    };

    await next();
  }
}
