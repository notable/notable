
/* CRITICAL */

//TODO: Publish it as `browser-critical-css` or something

const Critical = { // Extract the critical CSS from the current page, *SO MUCH* smaller and faster than `critical`, which downloads a whole browser for this, but it may output slightly larger strings

  /* HELPERS */

  _getDocClone ( doc: Document = document ): Document {

    const clone = doc.implementation.createHTMLDocument ();

    clone.documentElement.innerHTML = doc.documentElement.innerHTML;

    return clone;

  },

  _getDocType ( doc: Document = document ): string {

    return new XMLSerializer ().serializeToString ( doc.doctype as Node ); //TSC

  },

  _getHTML ( doc: Document = document ): string {

    return doc.documentElement.outerHTML;

  },

  _getFullHTML ( doc: Document = document ) : string {

    const doctype = Critical._getDocType ( doc ),
          html = Critical._getHTML ( doc );

    return `${doctype}${html}`;

  },

  _getStyleSheets ( doc: Document = document ): StyleSheet[] {

    return Object.values ( doc.styleSheets );

  },

  _filterCriticalCSS ( doc: Document = document, stylesheet ): string {

    const {rules} = stylesheet;

    let css = '';

    for ( let id in rules ) {

      const {selectorText, cssText} = rules[id];

      if ( !selectorText || !cssText ) continue;

      const selector = selectorText.replace ( /(\w)\:+(before|after)/gmi, '$1' ); // Otherwise these pseudoselectors won't match

      if ( doc.querySelectorAll ( selector ).length ) css += ` ${cssText}`;

    }

    return css;

  },

  /* API */

  get ( options: { transform?: Function } = {} ) {

    const styleSheets = Critical._getStyleSheets ();

    let clone = Critical._getDocClone ();

    if ( options.transform ) clone = options.transform ( clone ) || clone;

    const css = styleSheets.map ( stylesheet => Critical._filterCriticalCSS ( clone, stylesheet ) ).join ( ' ' ),
          style = document.createElement ( 'style' );

    style.innerHTML = css;

    ( clone.documentElement.firstElementChild as Element ).appendChild ( style );

    const html = Critical._getFullHTML ( clone ).replace ( /\n/g, '' );

    return html;

  }

};

/* EXPORT */

export default Critical;
