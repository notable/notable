
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

  render () {

    return (
      <form className="multiple joined no-separators grow">
        <input ref={this.ref} autoFocus type="search" className="bordered grow small" placeholder="Search notes..." defaultValue={this.props.query} onChange={this.onChange} />
        <div className="label bordered xsmall" title="Search">
          <i className="icon">magnify</i>
        </div>
      </form>
    );

  }

}

/* EXPORT */

export default connect ({
  container: Main,
  shouldComponentUpdate: false,
  selector: ({ container }) => ({
    query: container.search.getQuery (),
    setQuery: container.search.setQuery
  })
})( Search );
