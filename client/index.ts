import { Stardust } from './Stardust';

declare global {
  interface Window {
    stardust: { namedRoutes: Record<string, string> };
  }
}

export let stardust;

/**
 * Initialize stardust
 */
export function initRoutes() {
  const { namedRoutes } = window.stardust;
  stardust = new Stardust(namedRoutes);
}
