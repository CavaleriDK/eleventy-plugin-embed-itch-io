const deepmerge = require('deepmerge');
const asyncReplace = require('string-replace-async');
const defaults = require('./libs/defaultconfig');
const embed = require('./libs/embed');
const parser = require('./libs/parseregex');
const pattern = require('./libs/searchpattern');

module.exports = (eleventyConfig, options = {}) => {
    const config = deepmerge(defaults, options);

    if (config.useTransform) {
        eleventyConfig.addTransform('embedItchIo', async (content, resultPath) => {
            if (!resultPath || !resultPath.endsWith('.html')) {
                return content;
            }
            return await asyncReplace(content, pattern, async (...match) => {
                const parsed = parser(match);
                return await embed(parsed.itchUrl, parsed.fullMatch, config);
            });
        });
    }
    if (config.useShortcode) {
        eleventyConfig.addAsyncShortcode('embedItchIo', async (url) => {
            return await embed(url, '', config);
        });
    }
};
