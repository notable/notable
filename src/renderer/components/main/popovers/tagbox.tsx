
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

/* TAGBOXY */

class Tagbox extends React.PureComponent<{ onChange: Function, tags: string[], className?: string }, {}> {

  $tagbox;

  componentDidMount () {

    this.$tagbox = $(ReactDOM.findDOMNode ( this ));

    this.$tagbox.widgetize ();

    if ( this.props.onChange ) {

      this.$tagbox.on ( 'tagbox:change', () => this.props.onChange ( this.$tagbox.tagbox ( 'get' ) ) );

    }

  }

  componentDidUpdate () {

    this.$tagbox.tagbox ( 'option', 'tags', this.props.tags );

  }

  render () {

    const {className, tags} = this.props;

    return (
      <div className={`tagbox card-footer bordered ${className}`}>
        <input defaultValue={tags} className="hidden" />
        <input autoFocus={true} placeholder="Add tags..." className="tagbox-partial autogrow autofocus compact small" />
      </div>
    );

  }

}

/* EXPORT */

export default Tagbox;
