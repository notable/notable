
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';

/* SEARCH */

class Search extends React.Component<any, undefined> {
 
  ref = React.createRef () as any; //TSC

  onChange = _.debounce ( () => {
    
    this.props.setQuery ( this.ref.current.value );

  }, 50 );

  constructor ( props ) {

    super ( props );

    this.onClearSearch = this.onClearSearch.bind ( this );

  }
  
  onClearSearch() {

    this.props.clearQuery()

    this.ref.current.value = ""

  }

  render () {
    const isSearching = this.props.query && this.props.query.length > 0

    return (
      <div className="multiple joined no-separators grow search">
        <input ref={this.ref} autoFocus type="search" className="bordered grow small" placeholder="Search notes..." defaultValue={this.props.query} onChange={this.onChange} />
        <div className="label bordered xsmall" title={isSearching ? "Clear search" : "Search"}>
          {isSearching && <i className="icon actionable" onClick={this.onClearSearch}>close</i>}
          {!isSearching && <i className="icon">magnify</i>}
        </div>
      </div>
    );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: true,
  selector: ({ container }) => ({
    query: container.search.getQuery (),
    setQuery: container.search.setQuery,
    clearQuery: container.search.clear,
  })
})( Search );
