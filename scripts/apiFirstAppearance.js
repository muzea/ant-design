/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const indexName = 'index.zh-CN.md';
const tableOrignHead = '| 参数 | 说明 | 类型 | 默认值 |';
const tableNewHead = '| 参数 | 说明 | 类型 | 默认值 | 版本 |';
const meta = {};
const versions = [];
let maxVersion = '';
const result = {};

function isGreater(verA, verB) {
  const numsA = verA.split('.').map(it => parseInt(it, 10));
  const numsB = verB.split('.').map(it => parseInt(it, 10));
  return numsA[1] * 100 + numsA[2] - numsB[1] * 100 - numsB[2];
}

/**
 * 
 * @param {string[]} xs 
 * @param {*} getKey 
 * @returns {{[key: string]: string[]}}
 */
function groupBy(xs, getKey) {
  return xs.reduce((rv, x) => {
    const key = getKey(x);
    if (!Array.isArray(rv[key])) {
      rv[key] = [];
    }
    rv[key].push(x);
    return rv;
  }, {});
};

/**
 * 
 * @param {string[]} apiList 
 * @param {{[key: string]: string}} result 
 */
function addMetaToMD(apiList, versionInfo) {
  const byFile = groupBy(apiList, key => key.split('@')[0]);
  const components = Object.keys(byFile);
  for (const componentName of components) {
    const filePath = `components/${componentName}/${indexName}`
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let prevTitle = '';
    let startPos = 0;
    for (const iterator of byFile[componentName]) {
      const [ , title, propName ] = iterator.split('@');
      if (title !== prevTitle) {
        prevTitle = title;
        startPos = lines.indexOf(title);
        const headPos = lines.indexOf(tableOrignHead, startPos);
        if (headPos !== -1) {
          lines[headPos] = tableNewHead;
          lines[headPos+1] += ' --- |';
        }
      }
      const propPos = lines.findIndex((value, index) => index > startPos && value.startsWith(`| ${propName}`));
      lines[propPos] += ` ${versionInfo[iterator]} |`;
    }
    fs.writeFileSync(filePath, lines.join('\n'));
  }
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
  addMetaToMD(meta[maxVersion], result);
  // eslint-disable-next-line no-console
});
