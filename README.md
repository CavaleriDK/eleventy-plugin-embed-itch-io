<h2 align="center">eleventy-plugin-embed-itch-io</h2>
<p align="center">11ty plugin for embedding Itch.io games in Markdown files from the game page url.</p>

# Getting started

![NPM Version](https://img.shields.io/npm/v/eleventy-plugin-embed-itch-io) ![Node LTS](https://img.shields.io/node/v-lts/eleventy-plugin-embed-itch-io) ![NPM License](https://img.shields.io/npm/l/eleventy-plugin-embed-itch-io)

This is a plugin for [Eleventy](https://www.11ty.dev/) which automatically creates an [Itch.io embed widget](https://itch.io/docs/creators/widget) from a URL to a game's page.

Install the latest version of this package using npm `npm install eleventy-plugin-embed-itch-io`

### Setup

Then add it to your [Eleventy config](https://www.11ty.dev/docs/config/) file:

```js
const embedItchIo = require("eleventy-plugin-embed-itch-io");

module.exports = function(eleventyConfig) {
    ...
    eleventyConfig.addPlugin(embedItchIo);
    ...
};
```

To embed a game widget into any Markdown page, paste its URL into a new line without any other content on the same line.

### Markdown example:

```markdown
Playing games is almost as fun a pastime activity as making games yourself. Although very time consuming both can be very rewarding.

https://cavaleri.itch.io/getting-around-it

This game though was just as painful to play as it was to make.
```

### Rendered result
![Itch.io widget for the game: Getting Around It](/documentation/embedded.png)

## Advanced usage

### Configurations
The following optional configurations can be used to alter the behaviour of this plugin. To change the configuration, set the target config object when adding the plugin in your eleventy config:

```js
eleventyConfig.addPlugin(embedItchIo, {
  darkMode: true
});
```

| Configuration  | Default                                                                                                    | Notes                                                                                                                                                             |
|----------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| iframeClass    | `'itch-io-responsive-iframe'`                                                                              | Class name for the iframe widget. Useful for appending additional styles.                                                                                         |
| iframeStyle    | `'position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; max-height: 175px;` | Override the inline style for the iframe widget.                                                                                                                  |
| containerClass | `'itch-io-container'`                                                                                      | Class name for the container div. Useful for appending additional styles.                                                                                         |
| containerStyle | `'position: relative; aspect-ratio: 552 / 167; width:100%; max-height: 175px;'`                            | Override the inline style for the container div.                                                                                                                  |
| cacheDuration  | `'1w'`                                                                                                     | Cache duration. Use the cache duration syntax from  [@11ty/eleventy-fetch](https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration) to set this value. |
| darkMode       | `false`                                                                                                    |   Use darkmode. Adds `?dark=true` get parameter to the iframe src. See [widget example](https://itch.io/docs/creators/widget) for demonstration.                  |

### Responsiveness
The widget is fully responsive by utilizing the [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio]) css property on the container div. However, the Itch.io widget has a max height of `175px` before the widget is padded with black background colour. To work around this, the container div has a max height of `175px` and a width of `100%` to make sure we break the aspect ratio when going above `175px`;

### Nunjucks example

The plugin can be used on other formats that markdown and will replace any instance of a link to an Itch.io game which is surrounded by its own `<p></p>` tags. Elventy [transforms](https://www.11ty.dev/docs/config/#transforms) are used to embed the widget, so it alters Eleventy’s HTML output as it’s generated. It doesn’t alter the source file.

```html
<body>
    <p>Playing games is almost as fun a pastime activity as making games yourself. Although very time consuming both can be very rewarding.</p>
    <p>https://cavaleri.itch.io/getting-around-it</p>
    <p>This game though was just as painful to play as it was to make.</p>
</body>
```

### Additional notes

- This plugin is deliberately designed _only_ to embed widgets when the URL is on its own line, and not inline with other text.
- To do this, it uses a regular expression to recognize Itch.io game URLs. Currently these are the limitations on what it can recognize in a HTML output:
  - The URL *must* be wrapped in a paragraph tag: `<p>`
  - It *can* also be wrapped in an anchor tag, (*inside* the paragraph): `<a>`
  - The URL string *can* have whitespace around it

## Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/CavaleriDK/eleventy-plugin-embed-itch-io/issues).

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md) 