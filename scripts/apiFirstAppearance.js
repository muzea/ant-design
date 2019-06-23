/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const meta = {};
const versions = [];
let maxVersion = '';
const result = {};

function isGreater(verA, verB) {
  const numsA = verA.split('.').map(it => parseInt(it, 10));
  const numsB = verB.split('.').map(it => parseInt(it, 10));
  return numsA[1] * 100 + numsA[2] - numsB[1] * 100 - numsB[2];
}

glob('meta/*.json', (error, files) => {
  files.forEach(filePath => {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const version = path.basename(filePath, path.extname(filePath));
    versions.push(version);
    meta[version] = content;
  });
  versions.sort(isGreater).reverse();
  [maxVersion] = versions.splice(0, 1);
  for (const api of meta[maxVersion]) {
    let faVersion = maxVersion;
    for (const currentVersion of versions) {
      if (meta[currentVersion].includes(api)) {
        faVersion = currentVersion;
      }
    }
    result[api] = faVersion;
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(result, null, 2));
});
