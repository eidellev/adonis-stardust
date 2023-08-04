import test from 'japa';
import { setup, teardown } from './utils';

test.group('Server', (group) => {
  group.afterEach(async () => {
    await teardown();
  });

  test('Should handle empty router gracefully', async (assert) => {
    const app = await setup();
    await app.start();

    const view = app.container.use('Adonis/Core/View');

    view.registerTemplate('dummy', { template: '@routes()' });

    assert.equal(
      (await view.render('dummy')).trim(),
      `<script>
  (globalThis || window).stardust = {namedRoutes: {}};
</script>`,
    );
  });

  test('Should render nonce', async (assert) => {
    const app = await setup();
    await app.start();

    const view = app.container.use('Adonis/Core/View');
    const renderer = view.share({ cspNonce: 'test' });

    assert.equal(
      (await renderer.renderRaw('@routes')).trim(),
      `<script nonce="test">
  (globalThis || window).stardust = {namedRoutes: {}};
</script>`,
    );
  });

  test('Should render named routes', async (assert) => {
    const app = await setup();
    const router = app.container.use('Adonis/Core/Route');
    const view = app.container.use('Adonis/Core/View');

    router.get('/', async () => {}).as('index');
    router.post('/users', async () => {}).as('users.store');
    router.commit();

    await app.start();

    view.registerTemplate('dummy', { template: '@routes()' });
    const dummy = await view.render('dummy');

    assert.equal(
      dummy.trim(),
      `<script>
  (globalThis || window).stardust = {namedRoutes: {"index":{"pattern":"/","methods":["HEAD","GET"]},"users.store":{"pattern":"/users","methods":["POST"]}}};
</script>`,
    );
  });
});
