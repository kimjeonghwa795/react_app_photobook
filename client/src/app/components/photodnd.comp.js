import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';

import p_system from '../common/PhotoSystem'
import history from '../common/history';
import Photo from './photo.comp'
import PhotoBoard from './photoboard.comp'

@hot(module)
@DragDropContext(HTML5Backend)
export default class extends Component {
    constructor(){
        super();
        this.state={
            folderPosition : [0,0],
            targetId : null,
            size : null,
            frameBox : undefined,
        };
    }

    observer = (x,y)=>{
        this.setState({
            folderPosition : [x,y]
        })
    }
    
    componentDidMount() {
        p_system.init().setObserver(this.observer)
    }

    componentWillReceiveProps(nProps){
        if(this.state.frameBox !== nProps.frameBox){
            this.setState({
                frameBox : nProps.frameBox
            })
        }
    }

    static propTypes = {
        folderPosition: PropTypes.arrayOf(
            PropTypes.number.isRequired
        ).isRequired
    };

    renderSquare(i) {
        let x = i % 8;
        let y = Math.floor(i / 8);
        x += 1
        y += 1
        if(this.props.count-1 === i && this.props.isTemplate && this.state.frameBox !== undefined)
        {
            let rect = this.state.frameBox.getBoundingClientRect()
            let style = {
                position : 'absolute',
                top : `${rect.top}px`,
                left : `${rect.left}px`,
                width : `${rect.width}px`,
                height : `${rect.height}px`,
                zIndex : 1
            }
            return (
                <div key={i} className={"folder-background"} style={style}>
                    <PhotoBoard x={x} y={y} isTemplate={true}>
                        {this.renderPiece(x, y, i)}
                    </PhotoBoard>
                </div>
            );
        } else{
            return (
                <div key={i} className={"folder-background"}>
                    <PhotoBoard x={x} y={y} isTemplate={false}>
                        {this.renderPiece(x, y, i)}
                    </PhotoBoard>
                </div>
            );
        }
        
    }

    renderPiece(x, y, i) {
        const [folderX, folderY] = this.state.folderPosition;
        if(i === this.props.count-1 && x === folderX && y === folderY){
            this.setState({
                folderPosition : [0,0]
            })
            return this.props.createPhoto(this.state.targetId,this.state.size)
        }
        else if(i !== this.props.count-1)
            return <Photo id={this.props.photoList[i].src} img_src={this.props.photoList[i].src} 
                size={this.props.photoList[i].size} targetId={this.state.targetId} 
                setTarget={(targetId,size)=>{this.setState({targetId : targetId, size: size})}}/>;        
    }

    render() {
        const squares1 = [];
        const squares2 = [];
        for (let i = 0; i < this.props.count; i++) {
            if(i % 2 === 0)
                squares1.push(this.renderSquare(i));
            else
                squares2.push(this.renderSquare(i));
        }

        return (
            <div className="filedir">
                <div className="div-divider">
                    {squares1}
                </div>
                <div className="div-divider">
                    {squares2}
                </div>
            </div>
        );
    }
}