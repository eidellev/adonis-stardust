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

```bash
npm i @eidellev/adonis-stardust

node ace configure @eidellev/adonis-stardust
```

## Setup

Create a named route in your stardust file:

```typescript
Route.get('users/:id', () => {
  ...
}).as('users.show');
```

Add the `@routes()` Edge tag to your main layout (before your application's JavaScript).

```blade
@routes()
@entryPointStyles('app')
@entryPolintScripts('app')
```

## Client-Side Usage

In your application's entrypoint:

```typescript
import { initRoutes } from '@eidellev/adonis-stardust';

initRoutes();
```

Now you can use the `stardust` helper to access your adonis routes:

```typescript
import { stardust } from '@eidellev/adonis-stardust';

stardust.route('users.show', { id: 1 }); // => `/users/1`

/**
 * You can also pass path params as an array and they will populated
 * according to their order:
 */
stardust.route('users.show', [1]); // => `/users/1`
```

You can also pass query parameters the following way:

```typescript
stardust.route('tasks.index', undefined, { qs: { tags: ['work', 'personal'] } }); // => `/tasks?tags=work,personal
```
