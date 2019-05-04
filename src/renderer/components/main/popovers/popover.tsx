
/* IMPORT */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

/* POPOVER */

class Popover extends React.Component<{ open: boolean, anchor: string, className?: string, onBeforeOpen?: Function, onOpen?: Function, onBeforeClose?: Function, onClose?: Function }, {}> {

  $popover;

  componentDidMount () {

    this.$popover = $(ReactDOM.findDOMNode ( this ));
    this.$popover.widgetize ();

    if ( this.props.onBeforeOpen ) this.$popover.on ( 'popover:beforeopen', this.props.onBeforeOpen );
    if ( this.props.onOpen ) this.$popover.on ( 'popover:open', this.props.onOpen );
    if ( this.props.onBeforeClose ) this.$popover.on ( 'popover:beforeclose', this.props.onBeforeClose );
    if ( this.props.onClose ) this.$popover.on ( 'popover:close', this.props.onClose );

    this.update ();

  }

  componentDidUpdate () {

    this.update ();

  }

  update () {

    this.$popover.popover ( 'toggle', this.props.open, $(this.props.anchor)[0] ).trigger ( 'change' );

  }

  render () {

    const {id, children} = this.props;

    return (
      <div id={id} className="popover card bordered">
        {children}
      </div>
    );

  }

}

/* EXPORT */

export default Popover;
