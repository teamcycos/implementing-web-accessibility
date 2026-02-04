const path = require('path');
const os = require('os');

module.exports = {
  ruleArchive: 'latest',
  policies: ['IBM_Accessibility', 'WCAG_2_2'],
  failLevels: ['violation'],
  reportLevels: [
    'violation',
    'potentialviolation',
    'recommendation',
    'potentialrecommendation',
    'manual'
  ],
  outputFormat: ['html', 'json'],
  outputFilenameTimestamp: true,
  label: [process.env.TRAVIS_BRANCH || 'local-scan'],
  outputFolder: path.resolve(__dirname, 'results'),
  baselineFolder: path.resolve(__dirname, 'test', 'baselines'),
  cacheFolder: path.join(os.tmpdir(), 'accessibility-checker'),
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  ignore: ['style_highcontrast_visible', 'style_color_misuse', 'text_block_heading', 'potential_heading'], // works only with empty failLevels []
  ignoreRules: ['style_highcontrast_visible', 'style_color_misuse', 'text_block_heading', 'potential_heading']
};
