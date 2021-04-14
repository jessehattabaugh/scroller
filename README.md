# scroller
a game about scrolling

## hosted on render.com

https://scroller.onrender.com


## development

I wanted to do this a little differently, so there's no build step. To view this local copy in a browser you can run `npm start`. Dependencies are fetched from `skypack` at runtime. No transpilation is performed, so only JavaScript syntax is supported. No polyfills are loaded, so only most recent browsers are supported. No HMR is done so you have to reload the page manually. I've included config files for .editorconfig, .prettier and typescript, but these tools are provided by VSCode. There's no tests, I'm flying blind.
