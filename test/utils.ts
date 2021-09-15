import { Filesystem } from '@poppinss/dev-utils';
import { join } from 'path';
import { Application } from '@adonisjs/core/build/standalone';

export const fs = new Filesystem(join(__dirname, 'app'));

export async function setup() {
  await fs.add(
    'config/app.ts',
    `export const appKey = '${Math.random().toFixed(36).substring(2, 38)}',
    export const http = {
      cookie: {},
      trustProxy: () => true,
    }`,
  );

  const app = new Application(fs.basePath, 'web', {
    providers: ['@adonisjs/core', '@adonisjs/view', '../../providers/StardustProvider'],
  });

  await app.setup();
  await app.registerProviders();
  await app.bootProviders();
  await app.start();

  return app;
}

export async function teardown() {
  await fs.cleanup();
}
