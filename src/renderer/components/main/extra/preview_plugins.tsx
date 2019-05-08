
/* IMPORT */

import * as _ from 'lodash';
import {ipcRenderer as ipc} from 'electron';
import {connect} from 'overstated';
import {Component} from 'react-component-renderless';
import Main from '@renderer/containers/main';

/* PREVIEW PLUGINS */

class PreviewPlugins extends Component<{ container: IMain }, {}> {

  /* SPECIAL */

  componentDidMount () {

    $.$document.on ( 'click', '.preview a.note', this.__noteClick );
    $.$document.on ( 'click', '.preview a.tag', this.__tagClick );
    $.$document.on ( 'click', '.preview input[type="checkbox"]', this.__checkboxClick );
    $.$document.on ( 'click', '.preview .copy', this.__copyClick );
    $.$document.on ( 'click', '.preview .mermaid-open-external', this.__mermaidOpenExternalClick );

  }

  componentWillUnmount () {

    $.$document.off ( 'click', this.__noteClick );
    $.$document.off ( 'click', this.__tagClick );
    $.$document.off ( 'click', this.__checkboxClick );
    $.$document.off ( 'click', this.__copyClick );

  }

  /* HANDLERS */

  __noteClick = ( event ) => {

    const filePath = $(event.currentTarget).data ( 'filepath' ),
          note = this.props.container.note.get ( filePath );

    this.props.container.note.set ( note, true );

    return false;

  }

  __tagClick = ( event ) => {

    const tag = $(event.currentTarget).attr ( 'data-tag' );

    this.props.container.tag.set ( tag );

    return false;

  }

  __checkboxClick = ( event ) => {

    const $input = $(event.currentTarget),
          checked = $input.prop ( 'checked' ),
          nth = $input.data ( 'nth' );

    if ( !_.isNumber ( nth ) ) return;

    this.props.container.note.toggleCheckboxNth ( undefined, nth, checked );

  }

  __copyClick = ( event ) => {

    const $btn = $(event.currentTarget),
          $code = $btn.next ( 'pre' ).find ( 'code' );

    if ( !$code.length ) return;

    this.props.container.clipboard.set ( $code.text () );

  }

  __mermaidOpenExternalClick = ( event ) => {

    const $btn = $(event.currentTarget),
          $svg = $btn.next ( 'svg' );

    if ( !$svg.length ) return;

    const html = $svg.clone ().removeAttr ( 'style' )[0].outerHTML, // Removing the style attribute, ensuring the svg is displayed at full-width
          base64 = Buffer.from ( html ).toString ( 'base64' ),
          data = `data:image/svg+xml;base64,${base64}`;

    ipc.send ( 'mermaid-open', data ); //TODO: We should open this in the default browser instead, but it turns out that we can't open "data:*"" urls from here, perhaps we could set-up a special-purpose website to workaround this, something like https://notable.md/dataurl#data:image...

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false
})( PreviewPlugins );
