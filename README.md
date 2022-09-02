# Adonis Stardust

![](https://img.shields.io/npm/types/typescript?style=for-the-badge)
<a href="https://adonisjs.com/">
<img src="https://img.shields.io/badge/%E2%96%B2%20adonis-v5-5a45ff?style=for-the-badge">
</a>
<a href="https://prettier.io/">
<img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge">
</a>
<a href="">
<a href="https://www.npmjs.com/package/semantic-release">
<img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge"/>
</a>

# ⭐ Adonis Stardust ⭐

Use your adonis named stardust in the client.

## Installation

```shell
npm i @eidellev/adonis-stardust

node ace configure @eidellev/adonis-stardust
```

## Setup

### Register Middleware

Add the Stardust middleware to `start/kernel.ts`:

```typescript
Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('@ioc:EidelLev/Stardust/Middleware'),
]);
```

### Register a Named Route

Create a named route in your stardust file:

```typescript
Route.get('users/:id', () => {
  ...
}).as('users.show');
```

### In Your View

Add the `@routes` Edge tag to your main layout (before your application's JavaScript).

```blade
@routes
@entryPointStyles('app')
@entryPolintScripts('app')
```

## Client-Side Usage

### Client Setup

Stardust should be initialized as early as possible, e.g. in your application's entrypoint

```typescript
import { initRoutes } from '@eidellev/adonis-stardust/client';

initRoutes();
```

Now you can use the `stardust` helper to access your adonis routes:

```typescript
import { stardust } from '@eidellev/adonis-stardust/client';

stardust.route('users.show', { id: 1 }); // => `/users/1`

/**
 * You can also pass path params as an array and they will populated
 * according to their order:
 */
stardust.route('users.show', [1]); // => `/users/1`
```

You can also pass query parameters like so:

```typescript
stardust.route('tasks.index', undefined, { qs: { tags: ['work', 'personal'] } });
// `/tasks?tags=work,personal
```

### Checking the Current Route

```typescript
stardust.current; // => 'tasks.index'
stardust.isCurrent('tasks.index'); // => true
```
