import test from 'japa';
import { Stardust } from '../src/client/Stardust';
import { UrlBuilder } from '../src/client/UrlBuilder';

const namedRoutes = {
  'tasks.show': {
    pattern: '/tasks/:id',
    methods: ['GET'],
  },
  'tasks.update': {
    pattern: '/tasks/:id',
    methods: ['PUT'],
  },
};

test.group('Client', (group) => {
  group.afterEach(() => {
    delete globalThis.stardust;
    delete (globalThis as any).location;
  });

  test('should throw error if routes are not found', (assert) => {
    assert.throws(() => {
      // @ts-ignore
      new Stardust();
    }, 'Routes could not be found. Please make sure you use the `@routes()` tag in your view!');
  });

  test('should return all routes', (assert) => {
    const stardust = new Stardust(namedRoutes);

    assert.equal(stardust.getRoutes(), namedRoutes);
  });

  test('should resolve route with object params', (assert) => {
    const stardust = new Stardust(namedRoutes);

    assert.equal(stardust.route('tasks.show', { id: 1 }), '/tasks/1');
  });

  test('should resolve route with array of params', (assert) => {
    const stardust = new Stardust(namedRoutes);

    assert.equal(stardust.route('tasks.show', [1]), '/tasks/1');
  });

  test('should resolve route with query string', (assert) => {
    const stardust = new Stardust(namedRoutes);

    assert.equal(stardust.route('tasks.show', [1], { qs: { status: 'done' } }), '/tasks/1?status=done');
  });

  test('should resolve current route prioritizing GET routes', (assert) => {
    const stardust = new Stardust(namedRoutes);

    globalThis.stardust = { pathname: '/tasks/1' };

    assert.equal(stardust.current, 'tasks.show');
  });

  test('isCurrent should return true if current route matches', (assert) => {
    const stardust = new Stardust(namedRoutes);

    globalThis.stardust = { pathname: '/tasks/1' };

    assert.isTrue(stardust.isCurrent('tasks.show'));
  });

  test('isCurrent should return false if current route does not match', (assert) => {
    const stardust = new Stardust(namedRoutes);

    globalThis.stardust = { pathname: '/update' };

    assert.isFalse(stardust.isCurrent('tasks.show'));
  });

  test('current should default to window/globalThis when stardust global isnt available', (assert) => {
    const stardust = new Stardust(namedRoutes);

    (globalThis as any).location = { href: '/update' };

    assert.isFalse(stardust.isCurrent('tasks.show'));
  });

  test('should return a builder instance to build URL', (assert) => {
    const stardust = new Stardust(namedRoutes);

    assert.instanceOf(stardust.builder(), UrlBuilder);
  });
});
