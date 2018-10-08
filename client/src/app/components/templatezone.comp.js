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
        };
    }

    componentDidMount() {
        this.props.GetTemplates()
    }

    onClickTemplate = (templateId) =>{
        this.props.setTemplate(templateId)
    }

    onClickTemplateDelete = ()=> {
        this.props.setTemplate(null)
    }

    render() {
        return (
            <div className="tools">
                <div className="template-list">
                    {this.props.templateList ? this.props.templateList.map((item,idx)=>{
                        return(<div key={idx} className="template-icon">
                                <img draggable={false} alt={`template ${idx}`} src={item.frame} onClick={this.onClickTemplate.bind(this,item.templateId)}/>
                            </div>)
                    }) : <div></div>}
                    <button onClick={this.onClickTemplateDelete}>템플릿 삭제</button>
                </div>
            </div>
        );
    }
}