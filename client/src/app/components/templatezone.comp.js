import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import Network from '../common/Network'

import { 
    GetTemplates,
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        templateList: state.photobook.templateList
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetTemplates:()=>dispatch(GetTemplates()),
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            templateIndex : null,
            templateList : [],
            isLoading : true,
            selectTemplateId : null
        };
    }

    componentWillReceiveProps(nProps){
        if(nProps.templateIndex !== this.state.templateIndex){
            this.props.GetTemplates()
            this.setState({
                templateIndex : nProps.templateIndex
            })
        }
        if(this.state.templateList !== null && nProps.templateList !== undefined 
            && nProps.templateList !== null){
            if(nProps.templateList.length !== 0){
                let templateList = []
                for(let t of nProps.templateList){
                    if(t.isMain){
                        let d = {}
                        d['main'] = t
                        for(let sub of nProps.templateList){
                            if(t.category_id === sub.category_id && !sub.isMain){
                                d['sub'] = sub
                                break
                            }
                        }
                        templateList.push(d)
                    }
                }
                this.setState({
                    templateList : templateList,
                    isLoading : false
                })
            } else {
                this.setState({
                    isLoading : false
                })
            }
        }
    }

    componentDidMount() {
        this.props.GetTemplates()
    }

    onClickTemplate = (templateId) =>{
        if(this.state.selectTemplateId !== templateId){
            this.setState({
                selectTemplateId : templateId,
            })
        } else{
            this.setState({
                selectTemplateId : null
            })
        }
    }

    onClickPreview = async ()=>{
        let res = await this.getTemplateData(this.state.selectTemplateId)
        this.props.viewTemplate(this.state.selectTemplateId,res)
    }

    getTemplateData = (categoryId) =>{
        return new Promise((r)=>{
            let l = []
            for(let t of this.props.templateList){
                if(t.category_id === categoryId && !t.isMain)
                    l.push(t)
            }
            r(l)
        })
    }

    // onClickTemplateDelete = ()=> {
    //     this.props.setTemplate(null)
    // }

    render() {
        return (
            <div className="tools">
                {this.state.isLoading &&
                    <div className="loading-square">
                        <div className="loading-spin">
                        </div>
                    </div>
                }
                {!this.state.isLoading && this.state.templateList.length > 0 ? 
                <div className="template-list">
                        {this.state.templateList.map((item,idx)=>{
                            return(<div key={idx} className={`template-icon ${this.state.selectTemplateId === item['main'].category_id ? 'active' : ''}`}>
                                    <img draggable={false} alt={`template-main ${idx}`} src={item['main'].frame} onClick={this.onClickTemplate.bind(this,item['main'].category_id)}/>
                                    <img draggable={false} alt={`template-sub ${idx}`} src={item['sub'].frame} onClick={this.onClickTemplate.bind(this,item['sub'].category_id)}/>
                                </div>)
                        })}
                </div>
                : 
                <div className="alert">템플릿을 불러오지 못했습니다.</div>
                }
                <div className="template-preview" onClick={this.onClickPreview}>
                    <img alt="미리보기" src={require('../resources/template_preview.png')} />
                </div>
            </div>
        );
    }
}