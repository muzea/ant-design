const glob = require('glob');
const fs = require('fs');

const COMPONENT_NAME = /components\/([^/]*)/;
const PROP_NAME = /^\s*\|\s*([^\s|]*)/;

const result = [];

glob('components/*/*.en-US.md', (error, files) => {
  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const component = filePath.match(COMPONENT_NAME)[1];
    const lines = content.split(/[\r\n]+/);
    lines.forEach((line, index) => {
      const propMatch = line.match(PROP_NAME);
      if (!propMatch) return;

      const propName = propMatch[1];
      if (!/^[a-z]/.test(propName)) return;
      let titleIndex = index;
      while (titleIndex) {
        if (lines[titleIndex].startsWith('##')) {
          break;
        }
        titleIndex -= 1;
      }
      const title = lines[titleIndex];
      result.push(`${component}@${title}@${propName}`);
    });
  });
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(result, null, 2));
});
