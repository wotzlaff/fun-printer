// Extracts the webpack module map from the uni-app app-service.js bundle
// by executing only the webpackJsonp.push call inside a Node vm sandbox.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const SRC = path.join(__dirname, 'vendor-bundles', 'app-service.js');
const OUT = path.join(__dirname, 'modules');

const captured = [];
const sandbox = {
  webpackJsonp: {
    push(arr) { captured.push(arr); },
  },
  // uni-app / HTML5+ globals are only referenced at module-execution time,
  // not at push time; still provide dummies in case of top-level access.
  self: {}, window: {}, global: {}, navigator: { userAgent: 'node' },
  console, setTimeout, setInterval, clearTimeout, clearInterval,
  Promise, Date, Math, JSON, Error, RegExp, Array, Object, String, Number,
  Boolean, Map, Set, Symbol, WeakMap, WeakSet, Proxy, Reflect,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const code = fs.readFileSync(SRC, 'utf8');
try {
  vm.runInContext(code, sandbox, { filename: 'app-service.js', timeout: 60000 });
} catch (e) {
  // Expected: later top-level app boot code may fail in Node; the push already happened.
  console.error('Note: bundle execution stopped:', e.message);
}

console.error('pushes captured:', captured.length);
const modules = {};
for (const arr of captured) {
  // push([chunkNames, moduleMap, entryIds?])
  const map = arr && arr[1];
  if (map && typeof map === 'object') Object.assign(modules, map);
}
const ids = Object.keys(modules);
console.error('modules found:', ids.length);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(ids.sort(), null, 2));

// Write each module body to its own file, named by module id.
for (const id of ids) {
  const fn = modules[id];
  const safe = id.replace(/[^\w.-]/g, '_');
  fs.writeFileSync(path.join(OUT, safe + '.js'), fn.toString());
}
console.error('written to', OUT);
