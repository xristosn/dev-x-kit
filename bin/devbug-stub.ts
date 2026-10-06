// Stub for devbug a CLI debugging utility bundled inside @gecka/styleflux.
// devbug uses require('../../../package.json') which Turbopack can't resolve
// in node_modules. This stub replaces it entirely; devbug is only used for
// debug logging and isn't needed for CSS conversion.
export const _forceDebugMode = { value: false };
export const dbg = () => {};
export const msg = () => {};
export const colors = {
  RED: 'red',
  GREEN: 'green',
  YELLOW: 'yellow',
  BLUE: 'blue',
  GRAY: 'gray',
  PURPLE: 'magenta',
  CYAN: 'cyan',
  WHITE: 'white',
};

