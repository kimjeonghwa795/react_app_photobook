import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import {html2zip} from '../common/utils'
import Slot from './slot.comp'
import {HISTORYS} from '../common/constants'

import { 
    GetTemplateInfo,
    ResetTemplateInfo,
    UploadPhotobook,
    DeletePhoto,
    ResetPhotoState,
    DragPhoto,
    ResizePhoto,
    ResetStickerState,
    ResetTextBoxState,
    DeleteSticker,
    DeleteTextBox,
    DragSticker,
    DragTextBox,
    ResizeSticker,
    ResizeTextBox,
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        templateList : state.photobook.templateList,
        template : state.photobook.template,
        isCreate  :state.photobook.isCreate,
        isPhoto : state.photobook.isPhoto,
        photoSrc : state.photobook.photoSrc,
        isSticker : state.photobook.isSticker,
        stickerId : state.photobook.stickerId,
        isTextBox : state.photobook.isTextBox,
        undo : state.photobook.undo,
        redo : state.photobook.redo,
        pivot : state.photobook.pivot
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetTemplateInfo:(id)=>dispatch(GetTemplateInfo(id)),
        ResetTemplateInfo : ()=>dispatch(ResetTemplateInfo()),
        UploadPhotobook : (zip)=>dispatch(UploadPhotobook(zip)),
        ResetPhotoState : ()=>dispatch(ResetPhotoState()),
        ResetStickerState : ()=>dispatch(ResetStickerState()),
        ResetTextBoxState : ()=>dispatch(ResetTextBoxState()),
        DeletePhoto : (src,idx)=>dispatch(DeletePhoto(src,idx)),
        DeleteSticker : (id,idx)=>dispatch(DeleteSticker(id,idx)),
        DeleteTextBox : (txt,color,idx)=>dispatch(DeleteTextBox(txt,color,idx)),
        DragPhoto : (idx,prev,next)=>dispatch(DragPhoto(idx,prev,next)),
        DragSticker : (idx,prev,next)=>dispatch(DragSticker(idx,prev,next)),
        DragTextBox : (idx,prev,next)=>dispatch(DragTextBox(idx,prev,next)),
        ResizePhoto : (idx,prev,next)=>dispatch(ResizePhoto(idx,prev,next)),
        ResizeSticker : (idx,prev,next)=>dispatch(ResizeSticker(idx,prev,next)),
        ResizeTextBox : (idx,prev,next)=>dispatch(ResizeTextBox(idx,prev,next)),
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            templateId : null,
            isCreate : false,
            isSticker : false,
            isTextBox : false,
            isPhoto : false,
            photos : [],
            stickers: [],
            textboxes : [],
            textColor : [],
            undo : null,
            redo : null,
            pivot : 0,
            photosDragPos : [],
            stickersDragPos : [],
            textboxesDragPos : [],
            stickersResize : [],
            photosResize : [],
            textboxesResize : []
        }
        this.board_count = 100
    }
    componentWillReceiveProps(nProps) {
        if(nProps.templateId !== this.state.templateId){
            nProps.templateId === null ? this.props.ResetTemplateInfo() : this.props.GetTemplateInfo(nProps.templateId)
            this.setState({
                templateId : nProps.templateId
            })
        }
        if(nProps.isCreate !== this.state.isCreate){
            nProps.UploadPhotobook(this.CreatePhotobook())
            this.setState({
                isCreate : nProps.isCreate
            })
        }
        if(nProps.isPhoto !== this.state.isPhoto) {
            if(nProps.isPhoto)
                this.CreatePhoto(nProps.photoSrc)
            nProps.ResetPhotoState()
            this.setState({
                isPhoto : nProps.isPhoto
            })
        }
        if(nProps.isSticker !== this.state.isSticker){
            if(nProps.isSticker)
                this.CreateSticker(nProps.stickerId)
            nProps.ResetStickerState()
            this.setState({
                isSticker : nProps.isSticker
            })
        }
        if(nProps.isTextBox !== this.state.isTextBox){
            if(nProps.isTextBox)
                this.CreateTextbox()
            nProps.ResetTextBoxState()
            this.setState({
                isTextBox: nProps.isTextBox
            })
        }
        console.log(nProps.undo)
        if(nProps.undo !== this.state.undo || this.state.pivot-1 === nProps.pivot){
            this.setState({
                ...this.state,
                undo : nProps.undo,
                pivot : nProps.pivot
            })
            let data = nProps.undo[Object.keys(nProps.undo)[0]]
            switch(Object.keys(nProps.undo)[0]){
                case HISTORYS.C_P:
                    this.DeletePhoto(null, data['idx'])
                    break
                case HISTORYS.C_S : 
                    this.DeleteSticker(null,data['idx'])
                    break
                case HISTORYS.C_T : 
                    this.DeleteTextbox(null,data['idx'])
                    break
                case HISTORYS.D_P:
                    this.CreatePhoto(data)
                    break
                case HISTORYS.D_S:
                    this.CreateSticker(data)
                    break
                case HISTORYS.D_T:
                    this.CreateTextbox(data)
                    break
                case HISTORYS.DRAG_P:
                case HISTORYS.DRAG_S : 
                case HISTORYS.DRAG_T:
                    this.DragForceSlot(Object.keys(nProps.undo)[0],data['idx'],data['prev'])
                    break
                case HISTORYS.R_P:
                case HISTORYS.R_S : 
                case HISTORYS.R_T :
                    this.ResizeForceSlot(Object.keys(nProps.undo)[0],data['idx'],data['prev'])
                    break
                default:
                    break
            }
        }
        else if(nProps.redo !== this.state.redo || this.state.pivot+1 === nProps.pivot){
            this.setState({
                ...this.state,
                redo : nProps.redo,
                pivot : nProps.pivot
            })
            let data = nProps.redo[Object.keys(nProps.redo)[0]]
            switch(Object.keys(nProps.redo)[0]){
                case HISTORYS.C_P:
                    this.CreatePhoto(data)
                    break
                case HISTORYS.C_S :
                    this.CreateSticker(data)
                    break
                case HISTORYS.C_T : 
                    this.CreateTextbox(data)
                    break
                case HISTORYS.D_P:
                    this.DeletePhoto(null,data['idx'])
                    break
                case HISTORYS.D_S :
                    this.DeleteSticker(null,data['idx'])
                    break
                case HISTORYS.D_T:
                    this.DeleteTextbox(null,data['idx'])
                    break
                case HISTORYS.DRAG_P:
                case HISTORYS.DRAG_S:
                case HISTORYS.DRAG_T:
                    this.DragForceSlot(Object.keys(nProps.redo)[0],data['idx'],data['next'])
                    break
                case HISTORYS.R_P :
                case HISTORYS.R_S : 
                case HISTORYS.R_T :
                    this.ResizeForceSlot(Object.keys(nProps.redo)[0],data['idx'],data['next'])
                    break
                default:
                    break
            }
        }
    }

    CreatePhotobook = async () =>{
        let contents = this.refs.template
        return await html2zip(contents,this.props)
    }

    CreatePhoto = (src)=>{
        if(src !== undefined && src !== null){
            this.setState({
                photos: [...this.state.photos,{src: src,display : true}],
                photosDragPos : [...this.state.photosDragPos,null],
                photosResize : [...this.state.photosResize,null]
            })
        }
    }

    DeletePhoto = (src,idx)=>{
        if(src !== null){
            this.props.DeletePhoto(src,idx)
        }
        this.state.photos[idx === undefined ? this.state.photos.length-1 : idx].display = false
        this.setState({
            photos : this.state.photos
        })
    }

    CreateSticker = (id) =>{
        if(id !== undefined && id !== null){
            // id -> sticker api need
            this.setState({
                stickers : [...this.state.stickers, {id : id, src:"/photos/sticker1.png",display:true}],
                stickersDragPos : [...this.state.stickersDragPos, null],
                stickersResize : [...this.state.stickersResize, null]
            })
        }
    }

    DeleteSticker = (sticker_id,idx) =>{
        if(sticker_id !== null){
            this.props.DeleteSticker(sticker_id,idx)// bug fix need
        }

        this.state.stickers[idx === undefined ? this.state.stickers.length-1 : idx].display = false
        this.setState({
            stickers : [...this.state.stickers],
        })
    }

    CreateTextbox = (data)=>{
        this.setState({
            textboxes : [...this.state.textboxes, data === undefined ? null : data['txt']],
            textColor : [...this.state.textColor, data === undefined ? 'black' : data['color']],
            textboxesDragPos : [...this.state.textboxesDragPos, null],
            textboxesResize : [...this.state.textboxesResize, null]
        })
    }

    DeleteTextbox = (flag,idx) =>{
        if(flag !== null){
            this.props.DeleteTextBox(this.refs['textbox'+idx].textContent,this.state.textColor[idx],idx)
        }
        
        this.state.textboxes[idx === undefined ? this.state.textboxes.length -1 : idx] = false
        this.setState({
            textboxes : [...this.state.textboxes],
        })
    }

    ChangeTextColor = (idx,color) =>{
        let temp = this.state.textColor
        temp[idx] = color
        this.setState({
            textColor : temp
        })
    }

    DragForceSlot = (type,idx,pos)=>{
        switch(type){
            case HISTORYS.DRAG_P:
                this.state.photosDragPos[idx] = pos
                this.setState({
                    photosDragPos : this.state.photosDragPos
                })
                break
            case HISTORYS.DRAG_S: 
                this.state.stickersDragPos[idx] = pos
                this.setState({
                    stickersDragPos : this.state.stickersDragPos
                })
                break
            case HISTORYS.DRAG_T : 
                this.state.textboxesDragPos[idx] = pos
                this.setState({
                    textboxesDragPos : this.state.textboxesDragPos
                })
                break
            default : 
                break
        }
    }
    
    onDragStart = (type,idx)=>{
        switch(type){
            case HISTORYS.DRAG_P:
                this.state.photosDragPos[idx] = null
                this.setState({
                    photosDragPos : this.state.photosDragPos
                })
                break
            case HISTORYS.DRAG_S: 
                this.state.stickersDragPos[idx] = null
                this.setState({
                    stickersDragPos : this.state.stickersDragPos
                })
                break
            case HISTORYS.DRAG_T : 
                this.state.textboxesDragPos[idx] = null
                this.setState({
                    textboxesDragPos : this.state.textboxesDragPos
                })
                break
            default : 
                break
        }
    }

    onDragStop = (type,idx,prev,next)=>{
        switch(type){
            case HISTORYS.DRAG_P:
                this.props.DragPhoto(idx,prev,next)
                break
            case HISTORYS.DRAG_S: 
                this.props.DragSticker(idx,prev,next)
                break
            case HISTORYS.DRAG_T : 
                this.props.DragTextBox(idx,prev,next)
                break
            default : 
                break
        }
    }

    ResizeForceSlot = (type,idx,size)=>{
        switch(type){
            case HISTORYS.R_P:
                this.state.photosResize[idx] = size
                this.setState({
                    photosResize : this.state.photosResize
                })
                break
            case HISTORYS.R_S: 
                this.state.stickersResize[idx] = size
                this.setState({
                    stickersResize : this.state.stickersResize
                })
                break
            case HISTORYS.R_T : 
                this.state.textboxesResize[idx] = size
                this.setState({
                    textboxesResize : this.state.textboxesResize
                })
                break
            default : 
                break
        }
    }

    onResizeStart = (type,idx)=>{
        switch(type){
            case HISTORYS.R_P:
                this.state.photosResize[idx] = null
                this.setState({
                    photosResize : this.state.photosResize
                })
                break
            case HISTORYS.R_S: 
                this.state.stickersResize[idx] = null
                this.setState({
                    stickersResize : this.state.stickersResize
                })
                break
            case HISTORYS.R_T : 
                this.state.textboxesResize[idx] = null
                this.setState({
                    textboxesResize : this.state.textboxesResize
                })
                break
            default : 
                break
        }
    }

    onResizeStop = (type,idx,prev,next) =>{
        switch(type){
            case HISTORYS.R_P:
                this.props.ResizePhoto(idx,prev,next)
                break
            case HISTORYS.R_S: 
                this.props.ResizeSticker(idx,prev,next)
                break
            case HISTORYS.R_T : 
                this.props.ResizeTextBox(idx,prev,next)
                break
            default : 
                break
        }
    }

    render() {
        if(this.props.template !== null)
            return (
                <div className="template-frame" >
                    <div className="frame-button"><img alt="frame-button" src={require('../resources/blue_left.png')}/></div>
                    <div className="frame" ref="template" style={{border: this.props.template.style_border}} >
                        {this.state.photos.map((item,idx)=>{
                            if(item.display === false)
                                return
                            return(
                                <Slot key={idx} DeleteSlot={()=>{this.DeletePhoto(item.id,idx)}}
                                    dragForcePos={this.state.photosDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_P,idx)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_P,idx,prev,next)}}
                                    resizeForceSize={this.state.photosResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_P,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_P,idx,prev,next)}}>

                                    <img style={this.props.isCreate ? {} : {border: "1px dashed black"}} 
                                        draggable={false} alt="photo_img" src={item.src}/>
                                </Slot>)
                        })}
                        {this.state.stickers.map((item,idx)=>{
                            if(item.display === false)
                                return 
                            return (
                                <Slot key={idx} DeleteSlot={()=>{this.DeleteSticker(item.id,idx)}}
                                    dragForcePos={this.state.stickersDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_S,idx)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_S,idx,prev,next)}}
                                    resizeForceSize={this.state.stickersResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_S,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_S,idx,prev,next)}}>

                                    <img style={this.props.isCreate ? {} : {border: "1px dashed black"}} 
                                        draggable={false} alt="sticker" src={item.src}/>
                                </Slot>)
                        })}
                        {this.state.textboxes.map((item,idx)=>{
                            if(item === false)
                                return
                            return (
                                <Slot key={idx} defaultWidth={100} defaultHeight={100} isTextBox={true} ChangeTextColor={(color)=>{this.ChangeTextColor(idx,color)}}
                                    DeleteSlot={()=>{this.DeleteTextbox(true,idx)}} 
                                    dragForcePos={this.state.textboxesDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_T,idx)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_T,idx,prev,next)}}
                                    resizeForceSize={this.state.textboxesResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_T,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_T,idx,prev,next)}}>

                                    <div className="text-box" style={this.props.isCreate ? {} : {border: "1px dashed black",color: this.state.textColor[idx]}}
                                    contentEditable={true} ref={'textbox'+idx}>
                                    {item === null ? "" : item}
                                    </div>
                                </Slot>)
                        })}
                        <img draggable={false} className="frame-img" alt="frame" src={this.props.template.frame}/>
                        {this.props.children}
                    </div>
                    <div className="frame-button"><img alt="frame-button" src={require('../resources/blue_right.png')}/></div>
                </div>
            );
        else 
            return(
                <div className="template-frame">
                <div className="frame-button"><img alt="frame-button" src={require('../resources/blue_left.png')}/></div>
                    <div className="frame"></div>
                    <div className="frame-button"><img alt="frame-button" src={require('../resources/blue_right.png')}/></div>
                </div>
            );
    }
}