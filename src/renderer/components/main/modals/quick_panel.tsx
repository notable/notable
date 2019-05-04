
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import * as isShallowEqual from 'is-shallow-equal';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import Item from '@renderer/components/main/quick_panel/item';
import List from '@renderer/components/main/structures/list';
import Modal from './modal';

/* QUICK PANEL */

class QuickPanel extends React.Component<{ isOpen: boolean, setQuery: Function, toggleOpen: Function, query: string, results: QuickPanelResults }, {}> {

  inputRef = React.createRef<HTMLInputElement> ();

  shouldComponentUpdate ( nextProps ) {

    return this.props.isOpen !== nextProps.isOpen || !isShallowEqual ( this.props.results.items, nextProps.results.items ) || !isShallowEqual ( this.props.results.empty, nextProps.results.empty );

  }

  onChange = _.debounce ( () => {

    if ( !this.inputRef.current ) return;

    this.props.setQuery ( this.inputRef.current.value );

  }, 25 )

  getHeight = ( items: QuickPanelResultsNoteItem[] ) => {

    return Math.min ( items.length * 32, Math.min ( 400, ( window.innerHeight * .9 ) - 40 ) ); //UGLY: But it gets the job done, quickly

  }

  getItemKey = ( item: QuickPanelResultsNoteItem ) => {

    return item.filePath;

  }

  __beforeOpen = () => {

    if ( this.inputRef.current ) this.inputRef.current.value = '';

    this.props.setQuery ( '' ); // Resetting state

  }

  render () {

    const {isOpen, toggleOpen, query, results} = this.props;

    return (
      <Modal className="quick-panel" open={isOpen} onBeforeOpen={this.__beforeOpen} onBeforeClose={() => _.defer ( () => toggleOpen ( false ) )}>
        <input ref={this.inputRef} placeholder="Open note or attachment..." className="autofocus card-header bordered small" defaultValue={query} onChange={this.onChange} />
        <List className="list-quick-panel card-block" data={results.items} getHeight={this.getHeight} getItemKey={this.getItemKey} fallbackEmptyMessage={results.empty}>{Item}</List>
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
    update: container.quickPanel.update
  })
})( QuickPanel );
