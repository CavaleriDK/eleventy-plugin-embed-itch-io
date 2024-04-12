const deepmerge = require('deepmerge');
const asyncReplace = require('string-replace-async');
const defaults = require('./libs/defaultconfig');
const embed = require('./libs/embed');
const pattern = require('./libs/searchpattern');

module.exports = (eleventyConfig, options = {}) => {
    const config = deepmerge(defaults, options);

    eleventyConfig.addTransform('embedItchIo', async (content, resultPath) => {
        if (!resultPath || !resultPath.endsWith('.html')) {
            return content;
        }
        return await asyncReplace(content, pattern, async (...match) => {
            return await embed(match, config);
        });
    });
    return true;
};
