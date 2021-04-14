# EmojiScroller

a game about scrolling

## hosted on render.com

https://scroller.onrender.com

## development

I wanted to do this a little differently, so there's no build step.

To view local changes in a browser you can run `npm start`. Node.js is used for the development server, but nothing else. If you don't have Node.js installed in your environment you can serve the '/public' directory with your preferred web server instead. Dependencies are fetched from `skypack` at runtime.

-   No transpilation is performed, so only JavaScript syntax is supported.
-   No polyfills are loaded, so only most recent browsers are supported.
-   No HMR is done so you have to reload the page manually.

I've included config files for .editorconfig, .prettier and typescript, but these tools are provided by VSCode.

There's no tests, I'm flying blind.
