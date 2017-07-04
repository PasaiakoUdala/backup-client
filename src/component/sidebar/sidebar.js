import React, {Component} from 'react';
import styles from './styles';
import {Treebeard, decorators} from 'react-treebeard';
const axios = require('axios');

decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>
                {node.name}
            </div>
        </div>
    );
}

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cursor: {path:"/mnt/nfs/Aplik/.zfs/snapshot/"},
            selectedFs: this.props.selectedFs,
            myfs: []
        };
        this.onToggle = this.onToggle.bind(this);
    }

    componentDidMount() {
        const url = 'http://localhost:9000/lsdir';
        axios.get(url)
            .then(res => {
                const myfs = res.data;
                this.setState({ myfs });
            });
    }

    onToggle(node, toggled) {
        if (this.state.cursor) {
            this.setState({cursor: {active: false}});
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({cursor: node});
        if ((node!==null)&&(node!==undefined)) {
            // console.log(node.path);
            this.props.onFsChange(node.path);
        }

    }

    render() {
        const {data: stateData, cursor} = this.state;
        return (
            <div>
                <h4>da: {this.state.cursor.path}</h4>
                <Treebeard data={this.state.myfs} onToggle={this.onToggle} style={styles} />
                {/*<Treebeard data={this.state.cursor.path} onToggle={this.onToggle} onClick={this.onClick} style={styles} />*/}
            </div>

        );
    }
}

export default Sidebar;
