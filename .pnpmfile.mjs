export const hooks = {
  readPackage(pkg) {
    const needsLegacyApi =
      pkg.name === 'eslint-config-next' ||
      pkg.name === 'typescript-eslint' ||
      (typeof pkg.name === 'string' && pkg.name.startsWith('@typescript-eslint/')) ||
      pkg.name === 'ts-api-utils';

    if (needsLegacyApi && pkg.peerDependencies?.typescript) {
      // Make the API a private dependency so pnpm cannot bind it to the TS 7 peer.
      pkg.dependencies = {
        ...pkg.dependencies,
        typescript: 'npm:@typescript/typescript6@^6.0.2',
      };
      delete pkg.peerDependencies.typescript;
      delete pkg.peerDependenciesMeta?.typescript;
    }

    return pkg;
  },
};
