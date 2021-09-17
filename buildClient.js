require('esbuild').buildSync({
  entryPoints: ['client/index.ts'],
  outfile: 'build/client/index.js',
  allowOverwrite: true,
  bundle: true,
  platform: 'node',
  target: ['chrome91', 'edge90', 'firefox90', 'safari13'],
});
