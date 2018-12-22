
/* IMPORT */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Button from './multi_editor_button';

/* MULTI EDITOR TAGBOX */

class Tagbox extends React.PureComponent<any, any> {

  $wrapper; $tagbox;

  componentDidMount () {

    this.$wrapper = $(ReactDOM.findDOMNode ( this ));
    this.$tagbox = this.$wrapper.find ( '.tagbox' );

    this.$tagbox.widgetize ();

  }

  onClick = () => {

    const tags = this.$tagbox.tagbox ( 'get' );

    this.props.onClick ( tags );

  }

  render () {

    const {icon, title, placeholder} = this.props;

    return (
      <div className="multiple joined fluid">
        <div className="tagbox bordered fluid">
          <input name="name" defaultValue="" className="hidden" />
          <div className="tagbox-tags">
            <input name="partial_name" placeholder={placeholder} className="tagbox-partial autogrow compact small" />
          </div>
        </div>
        <Button icon={icon} title={title} onClick={this.onClick} />
      </div>
    );

  }

}

/* EXPORT */

export default Tagbox;
