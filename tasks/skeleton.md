
# Skeleton

The skeleton is the initial html that gets loaded, it should resemble what the fully-loaded application will look like.

This improves the perceived performance, as by using the skeleton we can now show the app's window much quicker.

## Generate it

Run the following:

```js
function minify ( str ) {
  return str.replace ( / *\n+ */gm, '' );
}

function clipboard ( str ) {
  const {clipboard} = require ( 'electron' );
  clipboard.writeText ( str );
  console.log ( 'Copied to clipboard!' );
}

function skeleton ( inlineCSS = true ) {
  const css = Array.from ( document.styleSheets ).map ( css => css.href ).filter ( _.identity );
  $('body > :not(#app)').remove ();
  $('#main').children ().not ( '#sidebar, #middlebar, #mainbar' ).remove ();
  $('#sidebar').children ().remove ();
  $('.layout-header, .layout-content').children ().remove ();
  $('#mainbar').children ().not ( '.layout-header, .layout-content' ).remove ();
  $('.editor').remove ();
  $('*').removeAttr ( 'style' );
  $('*').removeClass ( 'centerer react-window-list xsmall resizable' );
  $('head').children ().not ( 'meta[charset]' ).remove ();
  $('html').removeAttr ( 'class' );
  const doctype = new XMLSerializer ().serializeToString ( document.doctype );
  const html = `${doctype}${document.documentElement.outerHTML}`;
  if ( inlineCSS ) {
    const {generate} = require ( 'critical' );
    generate ( { html, css, inline: true }, ( err, res ) => clipboard ( minify ( res ) ) );
  } else {
    clipboard ( minify ( html ) );
  }
}

skeleton ();
```

## Update it

Paste the content of the clipboard to `src/renderer/index.html`.
