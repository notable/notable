
/* IMPORT */

import * as _ from 'lodash';
import * as React from 'react';
import {createElement} from 'react';
import {FixedSizeList} from 'react-window';

/* TREE */

class Tree extends React.Component<{ children, data: any[], selector: string, className?: string, FallbackEmptyComponent?, fallbackEmptyMessage?: string, getHeight?: Function, getItemChildren?: Function, getItemKey?: Function, filterItem?: Function, isFlat?: boolean, isFixed?: boolean, isKeyed?: boolean }, { height: number, items: any[], levels: number[], isLeafs: boolean[] }> {

  /* VARIABLES */

  listRef = React.createRef<FixedSizeList> ();
  innerRef = React.createRef<HTMLElement> ();

  /* STATE */

  state = {
    height: 0,
    items: [] as any[],
    levels: [] as number[],
    isLeafs: [] as boolean[]
  };

  /* LIFECYCLE */

  componentDidMount () {

    $.$window.on ( 'resize:height', this.updateHeight );
    $.$window.on ( 'scroll-to-item', `#${this.props.id}`, this.scrollToItem );

    this.update ();

  }

  componentWillUnmount () {

    $.$window.off ( 'resize:height', this.updateHeight );
    $.$window.off ( 'scroll-to-item', `#${this.props.id}`, this.scrollToItem );

  }

  componentWillReceiveProps ( propsNext ) {

    this.update ( propsNext );

  }

  componentDidUpdate () {

    if ( this.listRef.current && this.innerRef.current ) {

      const {scrollOffset} = this.listRef.current.state as any, //TSC
            {scrollTop} = this.innerRef.current;

      if ( scrollOffset !== scrollTop ) {

        this.listRef.current.setState ({ scrollOffset: scrollTop });

      }

    }

  }

  shouldComponentUpdate ( propsNext, stateNext ) {

    return this.state.items !== stateNext.items || this.state.height !== stateNext.height;

  }

  /* API */

  scrollToItem = ( event: Event, index: number ) => {

    if ( !this.listRef.current ) return;

    if ( !_.isNumber ( index ) ) {

      index = this.getItemIndex ( index );

      if ( !_.isNumber ( index ) || index < 0 ) return;

    }

    this.listRef.current.scrollToItem ( index, 'auto' );

  }

  getHeight = ( items: any[] ) => {

    return this.props.getHeight ? this.props.getHeight ( items ) : 0;

  }

  updateHeight = () => {

    const height = this.getHeight ( this.state.items );

    if ( height === this.state.height ) return;

    this.setState ({ height });

  }

  getItem = ( index: number ) => {

    return this.state.items[index];

  }

  getItemIndex = ( item ) => {

    return this.state.items.indexOf ( item );

  }

  getItemLevel = ( index: number ) => {

    if ( this.props.isFlat ) return 0;

    return this.state.levels[index];

  }

  getItemIsLeaf = ( index: number ) => {

    if ( this.props.isFlat ) return true;

    return this.state.isLeafs[index];

  }

  getItemKey = ( index: number ) => {

    const isNumber = _.isNumber ( index );

    if ( this.props.getItemKey ) {

      return isNumber ? this.props.getItemKey ( this.getItem ( index ) ) || index : this.props.getItemKey ( index ) || this.getItemIndex ( index );

    } else {

      return isNumber ? index : this.getItemIndex ( index );

    }

  };

  getItemChildren = this.props.getItemChildren || function ( item ) {

    return item.children;

  };

  filterItem = this.props.filterItem || _.constant ( true )

  getItems = ( data: any[], level: number = 0 ) => {

    if ( this.props.isFlat ) return { items: data.filter ( this.filterItem as any ), levels: [], isLeafs: [] }; //TSC

    const items: any[] = [],
          levels: number[] = [],
          isLeafs: boolean[] = [];

    data.forEach ( item => {

      if ( !this.filterItem ( item ) ) return;

      const children = this.getItemChildren ( item );

      items.push ( item );
      levels.push ( level );
      isLeafs.push ( !children || !children.length );

      if ( !children ) return;

      children.forEach ( item => {

        const {items: childrenItems, levels: childrenLevels, isLeafs: childrenIsLeafs} = this.getItems ( [item], level + 1 );

        items.push ( ...childrenItems );
        levels.push ( ...childrenLevels );
        isLeafs.push ( ...childrenIsLeafs );

      })

    });

    return {items, levels, isLeafs};

  }

  areItemsKeysEqual ( x, y ) {

    if ( x.length !== y.length ) return false;

    return x.every ( ( item, index ) => this.getItemKey ( item ) === this.getItemKey ( y[index] ) );

  }

  updateItems = ( props, callback? ) => {

    const {items, levels, isLeafs} = this.getItems ( props.data );

    if ( this.props.isKeyed && this.areItemsKeysEqual ( items, this.state.items ) && ( this.props.isFlat || ( _.isEqual ( levels, this.state.levels ) && _.isEqual ( isLeafs, this.state.isLeafs ) ) ) ) return; // Skipping unnecessary update, the keys didn't change

    this.setState ( {items, levels, isLeafs}, callback );

  }

  update = ( props = this.props ) => {

    this.updateItems ( props, this.updateHeight );

  }

  /* RENDER */

  render () {

    const {children, id, className, isFixed, FallbackEmptyComponent, fallbackEmptyMessage} = this.props;

    const {height, items} = this.state;

    if ( !items.length ) {

      if ( !FallbackEmptyComponent && !fallbackEmptyMessage ) return null;

      return (
        <div id={id} className={`tree list ${className || ''}`}>
          {FallbackEmptyComponent ? <FallbackEmptyComponent /> : (
            <div className="label list-item empty">
              <span className="title small">{fallbackEmptyMessage}</span>
            </div>
          )}
        </div>
      );

    } else if ( isFixed ) {

      return (
        <div id={id} className={`tree list ${className || ''}`}>
          <div className="multiple vertical joined">
            {items.map ( ( item, index ) => (
              createElement ( children, { key: index, item })
            ))}
          </div>
        </div>
      );

    } else {

      const outerElementType = React.forwardRef ( ( props, ref ) => <div ref={ref as any} id={id} {...props} /> ); //TSC

      return (
        <FixedSizeList ref={this.listRef} innerRef={this.innerRef} outerElementType={outerElementType} className={`tree list ${className || ''}`} height={height} width="auto" itemSize={32} itemCount={items.length} itemKey={this.getItemKey}>
          {({ index, style }) => {
            const item = this.getItem ( index );
            const itemKey = this.getItemKey ( item );
            const level = this.getItemLevel ( index );
            const isLeaf = this.getItemIsLeaf ( index );
            return createElement ( children, { index, style, item, itemKey, level, isLeaf });
          }}
        </FixedSizeList>
      );

    }

  }

}

/* EXPORT */

export default Tree;
