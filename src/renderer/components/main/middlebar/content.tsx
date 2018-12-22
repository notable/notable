
/* IMPORT */

import * as React from 'react';
import {VariableSizeList} from 'react-window';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Note from './note';

/* CONTENT */

class Content extends React.Component<any, { height: number }> {

  listRef;

  state = {
    height: 0
  };

  constructor ( props ) {

    super ( props );

    this.listRef = React.createRef ();

  }

  componentDidMount () {

    this.updateHeight ();

    $.$window.on ( 'notes-scroll-to-item', this.scrollToItem );
    $.$window.on ( 'resize', this.updateHeight );

  }

  componentWillUnmount () {

    $.$window.off ( 'notes-scroll-to-item', this.scrollToItem );
    $.$window.off ( 'resize', this.updateHeight );

  }

  scrollToItem = ( event, index ) => {

    if ( !this.listRef.current ) return;

    this.listRef.current.scrollToItem ( index, 'auto' );

  }

  updateHeight = () => {

    const height = window.innerHeight - 65; //UGLY: But it gets the job done, quickly

    this.setState ({ height });

  }

  render () {

    const {notes} = this.props,
          {height} = this.state;

    if ( !height ) return null;

    return (
      <VariableSizeList ref={this.listRef} overscanCount={3} className="layout-content react-window-list" height={height} width="auto" itemCount={notes.length} estimatedItemSize={38} itemSize={index => !index ? 48 : ( index === ( notes.length - 1 ) ? 43 : 38 )} itemKey={index => notes[index].filePath}>
        {({ index, style }) => (
          <Note style={style} note={notes[index]} />
        )}
      </VariableSizeList>
    );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    notes: container.search.getNotes ()
  })
})( Content );
