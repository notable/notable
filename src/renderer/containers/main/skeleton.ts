
/* IMPORT */

import critically from 'critically';
import {Container} from 'overstated';

/* SKELETON */

class Skeleton extends Container<SkeletonState, MainCTX> {

  /* API */

  get = async (): Promise<string> => {

    function transform ( doc: Document ) {
      const $html = $(doc.documentElement);
      $html.find ( 'head' ).children ().not ( 'meta[charset], style:not([data-critical]), link[rel="stylesheet"]' ).remove ();
      $html.find ( 'body' ).children ().not ( '.app, script[data-skeleton]' ).remove ();
      $html.find ( '.app' ).children ().not ( '.app-wrapper' ).remove ();
      $html.find ( '.app-wrapper' ).children ().not ( '.sidebar, .middlebar, .mainbar' ).remove ();
      $html.find ( '.sidebar' ).empty ();
      $html.find ( '.mainbar' ).children ().not ( '.layout-header' ).remove ();
      $html.find ( '.layout-header, .layout-content' ).empty ();
      $html.removeAttr ( 'class' );
      $html.find ( '[style]' ).removeAttr ( 'style' );
      $html.find ( '.tree, .list, .list-notes, .resizable, .xsmall' ).removeClass ( 'tree list list-notes resizable xsmall' );
      $html.find ( 'body' ).attr ( 'class', 'theme-light theme-dark' ); //TODO: This shouldn't be necessary, and won't scale with custom themes
    }

    let {html} = await critically ({ document, transform });

    html = html.replace ( 'theme-light theme-dark', `theme-${this.ctx.theme.get ()}` ); //TODO: This shouldn't be necessary, and won't scale with custom themes

    return html;

  }

  getToClipboard = async (): Promise<void> => {

    const skeleton = await this.get ();

    this.ctx.clipboard.set ( skeleton );

    console.log ( 'Skeleton copied to the clipboard!' );

  }

}

/* EXPORT */

export default Skeleton;
