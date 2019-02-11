
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {FixedSizeList} from 'react-window';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Item from '@renderer/components/main/quick_panel/item';
import Modal from './modal';

/* QUICK PANEL */

class QuickPanel extends React.Component<any, { height: number }> {

  inputRef = React.createRef () as any; //TSC
  listRef = React.createRef () as any; //TSC

  state = {
    height: 0
  };

  componentDidMount () {

    this.updateHeight ();

    $.$window.on ( 'quick-panel-scroll-to-item', this.scrollToItem );
    $.$window.on ( 'resize:height', this.updateHeight );

  }

  componentWillUnmount () {

    $.$window.off ( 'quick-panel-scroll-to-item', this.scrollToItem );
    $.$window.off ( 'resize:height', this.updateHeight );

  }

  componentWillReceiveProps ( nextProps ) {

    this.updateHeight ( nextProps );

  }

  scrollToItem = ( event, index ) => {

    if ( !this.listRef.current ) return;

    this.listRef.current.scrollToItem ( index, 'auto' );

  }

  updateHeight = ( props = this.props ) => {

    const height = Math.min ( props.results.items.length * 28, Math.min ( 400, ( window.innerHeight * .9 ) - 45 ) ); //UGLY: But it gets the job done, quickly

    if ( height === this.state.height ) return;

    this.setState ({ height });

  }

  onChange = _.debounce ( () => {

    this.props.setQuery ( this.inputRef.current.value );

  }, 25 )

  __beforeOpen = () => {

    this.inputRef.current.value = '';
    this.props.setQuery ( '' ); // Resetting state

  }

  __close = () => {

    this.props.setResults ({ empty: { is: true, message: '' }, items: [] }); // In order to have fewer DOM elements

  }

  render () {

    const {isOpen, toggleOpen, query, results, itemIndex} = this.props,
          {height} = this.state;

    return (
      <Modal id="quick-panel" open={isOpen} onBeforeOpen={this.__beforeOpen} onBeforeClose={() => _.defer ( () => toggleOpen ( false ) )} onClose={this.__close}>
        <input ref={this.inputRef} placeholder="Open note or attachment..." className="autofocus card-header bordered" defaultValue={query} onChange={this.onChange} />
        <div className="card-block">
          {results.empty.is ? <p className="empty">{results.empty.message}</p>: (
            <FixedSizeList ref={this.listRef} className="react-window-list" height={height} width="auto" itemCount={results.items.length} itemSize={28}>
              {({ index, style }) => (
                <Item nth={index} style={style} item={results.items[index]} isActive={index === itemIndex} />
              )}
            </FixedSizeList>
          )}
        </div>
      </Modal>
    );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isOpen: container.quickPanel.isOpen (),
    toggleOpen: container.quickPanel.toggleOpen,
    query: container.quickPanel.getQuery (),
    setQuery: container.quickPanel.setQuery,
    results: container.quickPanel.getResults (),
    setResults: container.quickPanel.setResults,
    itemIndex: container.quickPanel.getItemIndex (),
    update: container.quickPanel.update
  })
})( QuickPanel );
