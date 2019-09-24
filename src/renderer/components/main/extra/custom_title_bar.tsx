import { Component } from 'react-component-renderless';
import { Titlebar } from 'custom-electron-titlebar'
import pkg from '@root/package.json';

class CustomTitleBar extends Component<{}, {}> {

    titleBar!: Titlebar;

    componentDidMount() {

        this.titleBar = new Titlebar();
        this.titleBar.updateTitle(pkg.productName);

    }


    componentWillUnmount() {

        this.titleBar.dispose();
        
    }

}

export default CustomTitleBar;