
/* IMPORT */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

/* MODAL */

class Modal extends React.Component<{ open: boolean, onBeforeOpen?: Function, onOpen?: Function, onBeforeClose?: Function, onClose?: Function, className?: string }, {}> {

  $modal;

  componentDidMount () {

    this.$modal = $(ReactDOM.findDOMNode ( this ));

    this.$modal.widgetize ();

    if ( this.props.onBeforeOpen ) this.$modal.on ( 'modal:beforeopen', this.props.onBeforeOpen );
    if ( this.props.onOpen ) this.$modal.on ( 'modal:open', this.props.onOpen );
    if ( this.props.onBeforeClose ) this.$modal.on ( 'modal:beforeclose', this.props.onBeforeClose );
    if ( this.props.onClose ) this.$modal.on ( 'modal:close', this.props.onClose );

    this.update ();

  }

  componentDidUpdate () {

    this.update ();

  }

  update () {

    this.$modal.modal ( 'toggle', this.props.open ).trigger ( 'change' );

  }

  render () {

    const {className, children} = this.props;

    return (
      <div className={`modal card bordered ${className || ''}`}>
        {children}
      </div>
    );

  }

}

/* EXPORT */

export default Modal;
