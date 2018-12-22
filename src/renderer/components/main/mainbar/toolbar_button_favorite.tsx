
/* IMPORT */

import * as React from 'react';
import {connect} from 'overstated';
import Main from '@renderer/containers/main';
import ToolbarButton from './toolbar_button';

/* TOOLBAR BUTTON FAVORITE */

const FavoriteButton = ({ isFavorited, toggleFavorite }) => {

  if ( !isFavorited ) return <ToolbarButton icon="star_outline" title="Favorite" onClick={() => toggleFavorite ()} />

  return <ToolbarButton icon="star" title="Unfavorite" isActive={true} onClick={() => toggleFavorite ()} />;

};

/* EXPORT */

export default connect ({
  container: Main,
  selector: ({ container }) => ({
    isFavorited: container.note.isFavorited (),
    toggleFavorite: container.note.toggleFavorite
  })
})( FavoriteButton );
