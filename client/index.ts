import { Stardust } from './Stardust';

declare global {
  interface Window {
    stardust: { namedRoutes: Record<string, string> };
  }
}

export let stardust: Stardust;

/**
 * Initialize stardust
 */
export function initRoutes() {
  const { namedRoutes } = (globalThis ?? window).stardust;
  stardust = new Stardust(namedRoutes);
}
