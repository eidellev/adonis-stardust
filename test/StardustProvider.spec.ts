import test from 'japa';
import { setup, teardown } from './utils';

test.group('Server', (group) => {
  group.afterEach(async () => {
    await teardown();
  });

  test('Should handle empty router gracefully', async (assert) => {
    const app = await setup();
    const view = app.container.use('Adonis/Core/View');

    view.registerTemplate('dummy', { template: '@routes()' });

    assert.equal(
      (await view.render('dummy')).trim(),
      `<script>
  window.stardust = {namedRoutes: {}};
</script>`,
    );
  });
});
