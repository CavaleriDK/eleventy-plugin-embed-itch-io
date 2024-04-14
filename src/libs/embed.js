const downloadAndCache = require('@11ty/eleventy-fetch');
const { parse } = require('node-html-parser');

module.exports = async (itchUrl, fullMatch, config) => {
    try {
        const htmlResponse = await downloadAndCache(itchUrl, {
            duration: config.cacheDuration,
            type: 'text',
        });

        const html = parse(htmlResponse);
        const metaTag = html.querySelector(`meta[name="itch:path"]`);
        if (metaTag) {
            const titleTag = html.querySelector('title');
            const gameId = metaTag.getAttribute('content').replace('games/', '');
            const title = titleTag ? titleTag.text.trim() : itchUrl;
            const iframeSrcPostfix = config.darkMode ? `?dark=true` : ``;

            const aTag = `<a href="${itchUrl}">${title}</a>`;
            const iframeTag = `<iframe class="${config.iframeClass}" style="${config.iframeStyle}" frameborder="0" src="https://itch.io/embed/${gameId}${iframeSrcPostfix}">${aTag}</iframe>`;
            const divTag = `<div class="${config.containerClass}" style="${config.containerStyle}">${iframeTag}</div>`;

            return divTag;
        } else {
            console.error('Unable to find Itch.io game id by tag name: itch:path', itchUrl);
        }
    } catch (error) {
        console.error(error);
    }

    return fullMatch;
};
