module.exports = (match) => {
    let fullMatch, url;
    [
        fullMatch, // Full match
        ,
        ,
        url, // Itch.io URL without protocol
    ] = match;
    const itchUrl = `https://${url}`;

    return {itchUrl, fullMatch};
}