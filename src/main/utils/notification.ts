
/* IMPORT */

import {Notification as ENotification} from 'electron';

/* NOTIFICATION */

const Notification = {

  show ( title: string, body: string ) {

    const notification = new ENotification ({ title, body });

    notification.show ();

  }

};

/* EXPORT */

export default Notification;
