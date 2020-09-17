// @ts-check

const fs = require('fs');
const path = require('path');
const sass = require('sass');

module.exports = (targetOptions, originalIndexHtml) => {
  try {
    const preLoaderHtml = fs.readFileSync(path.join(__dirname, 'pre-loader.html'), { encoding: 'utf8' }).toString();
    const preLoaderCss = sass
      .renderSync({ file: path.join(__dirname, 'pre-loader.scss'), includePaths: ['node_modules'] })
      .css.toString();
    const preLoaderHtmlWithCss = preLoaderHtml.replace('<style></style>', `<style>${preLoaderCss}</style>`);

    const closingBodyTag = '</body>';
    const closingBodyTagIndex = originalIndexHtml.indexOf(closingBodyTag);
    if (closingBodyTagIndex === -1) {
      throw new Error('Cannot find body tag to place pre-loader inside of');
    }

    const newIndexHtml = `${originalIndexHtml.slice(
      0,
      closingBodyTagIndex,
    )}${preLoaderHtmlWithCss}${originalIndexHtml.slice(closingBodyTagIndex)}`;
    return newIndexHtml;
  } catch (error) {
    console.error(error);
    return new Error(error);
  }
};
