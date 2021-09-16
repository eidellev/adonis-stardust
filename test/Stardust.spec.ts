import test from 'japa';
import { Stardust } from '../client/Stardust';

test.group('Client', () => {
  test('should return all routes', (assert) => {
    const namedRoutes = { 'tasks.show': '/tasks/:id' };
    const stardust = new Stardust(namedRoutes);

    assert.equal(stardust.getRoutes(), namedRoutes);
  });

  test('should resolve route with object params', (assert) => {
    const stardust = new Stardust({ 'tasks.show': '/tasks/:id' });

    assert.equal(stardust.route('tasks.show', { id: 1 }), '/tasks/1');
  });

  test('should resolve route with array of params', (assert) => {
    const stardust = new Stardust({ 'tasks.show': '/tasks/:id' });

    assert.equal(stardust.route('tasks.show', [1]), '/tasks/1');
  });

  test('should resolve route with query string', (assert) => {
    const stardust = new Stardust({ 'tasks.show': '/tasks' });

    assert.equal(stardust.route('tasks.show', undefined, { qs: { status: 'done' } }), '/tasks?status=done');
  });
});
