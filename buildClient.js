require('esbuild').buildSync({
  entryPoints: ['src/client/index.ts'],
  outfile: 'client/index.js',
  allowOverwrite: true,
  bundle: true,
  platform: 'node',
  target: ['chrome91', 'edge90', 'firefox90', 'safari13'],
});
