const deepmerge = require('deepmerge');
const asyncReplace = require('string-replace-async');
const embed = require('../libs/embed');
const defaultconfig = require('../libs/defaultconfig');
const pattern = require('../libs/searchpattern');

/*
 *  Make sure we reset the regex index on every test.
 */
beforeEach(() => {
    pattern.lastIndex = 0;
});

/*
 *  Forbidden unit tests making real requests to the itch.io server.
 */
describe('Embedding itch.io page test', () => {
    const testContent = '<p>https://cavaleri.itch.io/getting-around-it</p>';

    test('Embed with default configuration', async () => {
        await expect(embed(pattern.exec(testContent), defaultconfig)).resolves.toBe(
            '<div class="itch-io-container" style="position: relative; aspect-ratio: 552 / 167; width:100%; max-height: 175px;"><iframe class="itch-io-responsive-iframe" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; max-height: 175px;" frameborder="0" src="https://itch.io/embed/1167885"><a href="https://cavaleri.itch.io/getting-around-it">Getting Around It by Michael Cavaleri</a></iframe></div>',
        );
    });

    test('Embed override iframeClass', async () => {
        await expect(
            embed(pattern.exec(testContent), deepmerge(defaultconfig, { iframeClass: 'overridden-class' })),
        ).resolves.toBe(
            '<div class="itch-io-container" style="position: relative; aspect-ratio: 552 / 167; width:100%; max-height: 175px;"><iframe class="overridden-class" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; max-height: 175px;" frameborder="0" src="https://itch.io/embed/1167885"><a href="https://cavaleri.itch.io/getting-around-it">Getting Around It by Michael Cavaleri</a></iframe></div>',
        );
    });

    test('Embed override iframeStyle', async () => {
        await expect(
            embed(pattern.exec(testContent), deepmerge(defaultconfig, { iframeStyle: 'overridden-style' })),
        ).resolves.toBe(
            '<div class="itch-io-container" style="position: relative; aspect-ratio: 552 / 167; width:100%; max-height: 175px;"><iframe class="itch-io-responsive-iframe" style="overridden-style" frameborder="0" src="https://itch.io/embed/1167885"><a href="https://cavaleri.itch.io/getting-around-it">Getting Around It by Michael Cavaleri</a></iframe></div>',
        );
    });

    test('Embed override containerClass', async () => {
        await expect(
            embed(pattern.exec(testContent), deepmerge(defaultconfig, { containerClass: 'overridden-class' })),
        ).resolves.toBe(
            '<div class="overridden-class" style="position: relative; aspect-ratio: 552 / 167; width:100%; max-height: 175px;"><iframe class="itch-io-responsive-iframe" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; max-height: 175px;" frameborder="0" src="https://itch.io/embed/1167885"><a href="https://cavaleri.itch.io/getting-around-it">Getting Around It by Michael Cavaleri</a></iframe></div>',
        );
    });

    test('Embed override containerStyle', async () => {
        await expect(
            embed(pattern.exec(testContent), deepmerge(defaultconfig, { containerStyle: 'overridden-style' })),
        ).resolves.toBe(
            '<div class="itch-io-container" style="overridden-style"><iframe class="itch-io-responsive-iframe" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; max-height: 175px;" frameborder="0" src="https://itch.io/embed/1167885"><a href="https://cavaleri.itch.io/getting-around-it">Getting Around It by Michael Cavaleri</a></iframe></div>',
        );
    });

    test('Embed override darkMode', async () => {
        await expect(embed(pattern.exec(testContent), deepmerge(defaultconfig, { darkMode: true }))).resolves.toBe(
            '<div class="itch-io-container" style="position: relative; aspect-ratio: 552 / 167; width:100%; max-height: 175px;"><iframe class="itch-io-responsive-iframe" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; max-height: 175px;" frameborder="0" src="https://itch.io/embed/1167885?dark=true"><a href="https://cavaleri.itch.io/getting-around-it">Getting Around It by Michael Cavaleri</a></iframe></div>',
        );
    });

    test('Embed return original content when unable to get game details', async () => {
        const failingContent = '<p>https://cavaleri.itch.io/game-that-never-existed</p>';
        await expect(
            embed(pattern.exec(failingContent), deepmerge(defaultconfig, { containerStyle: 'overridden-style' })),
        ).resolves.toBe(failingContent);
    });

    test('Embed can replace multiple links', async () => {
        const duplicatedContent = `${testContent}${testContent}`;
        const embedded = await asyncReplace(duplicatedContent, pattern, async (...match) => {
            return await embed(match, defaultconfig);
        });

        expect(embedded).toBe(
            '<div class="itch-io-container" style="position: relative; aspect-ratio: 552 / 167; width:100%; max-height: 175px;"><iframe class="itch-io-responsive-iframe" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; max-height: 175px;" frameborder="0" src="https://itch.io/embed/1167885"><a href="https://cavaleri.itch.io/getting-around-it">Getting Around It by Michael Cavaleri</a></iframe></div><div class="itch-io-container" style="position: relative; aspect-ratio: 552 / 167; width:100%; max-height: 175px;"><iframe class="itch-io-responsive-iframe" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; max-height: 175px;" frameborder="0" src="https://itch.io/embed/1167885"><a href="https://cavaleri.itch.io/getting-around-it">Getting Around It by Michael Cavaleri</a></iframe></div>',
        );
    });
});

/*
 * Verify that the regex search pattern is working as expected.
 */
describe('Pattern matches content', () => {
    const validContent = [
        '<p>https://cavaleri.itch.io/getting-around-it</p>',
        '<p>http://cavaleri.itch.io/getting-around-it</p>',
        '<p>cavaleri.itch.io/getting-around-it</p>',
        '<p>https://cavaleri.itch.io/g</p>',
        '<p>https://123.itch.io/1-2-3</p>',
        '<p><a href="https://cavaleri.itch.io/getting-around-it">https://cavaleri.itch.io/getting-around-it</a></p>',
        '<p>    https://cavaleri.itch.io/getting-around-it  </p>',
        `<p>
            https://cavaleri.itch.io/getting-around-it
        </p>`,
    ];
    const invalidContent = [
        '<p>https://itch.io/getting-around-it</p>',
        'https://cavaleri.itch.io/getting-around-it',
        '<p>https://cavaleri.itch.io</p>',
        '<a href="https://cavaleri.itch.io/getting-around-it">https://cavaleri.itch.io/getting-around-it</a>',
        '<p>This is my link: https://cavaleri.itch.io/getting-around-it</p>',
        '<p>https://cavaleri.itch.io/getting-around-it was my link</p>',
        '<span>https://cavaleri.itch.io/getting-around-it</span>',
        '<p>https://google.com</p>',
    ];

    for (let index = 0; index < validContent.length; index++) {
        const content = validContent[index];
        test('Pattern matches valid content #' + index, async () => {
            expect(content).toMatch(pattern);
        });
    }

    for (let index = 0; index < invalidContent.length; index++) {
        const content = invalidContent[index];
        test('Pattern ignores invalid content #' + index, async () => {
            expect(content).not.toMatch(pattern);
        });
    }
});
