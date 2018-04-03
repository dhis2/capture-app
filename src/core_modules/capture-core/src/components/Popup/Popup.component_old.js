// @flow
import React, {Component, PropTypes} from 'react';
import log from 'loglevel';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { CSSTransition, transit } from "react-css-transition"; 
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import './AbPopup.scss';
import styleBuilder from '../style/styleBuilder';

require('javascript-detect-element-resize');

class AbPopup extends Component {
    static defaultOverlayStyle = {
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.541176)",
        zIndex: 1500,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    };

    static defaultOverlayInnerStyle = {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        height: '100%',
        boxSizing: 'border-box'
    };

    static defaultTransitionContainerStyle = {
        display: "flex",
        minHeight: 0
    };

    static defaultContainerStyle = {        
        borderRadius: 5,
        display: "flex",
        backgroundColor: "white",
        position: "relative",
        width: '100%',
        flexDirection: "column"
    };

    static defaultInnerOuterContainerStyle = {
        padding: 10,
        display: "flex",        
        boxSizing: "border-box",
        minHeight: 0
    };

    static defaultInnerContainerStyle = {      
        boxSizing: "border-box",
        overflow: "auto",
        width: "100%"
    };

    static defaultHeaderContainerStyle = {

    };

    static defaultFooterContainerStyle = {

    };

    static defaultOverflowContainerStyle = {
        boxSizing: "border-box",
        padding: 10,
        width: "100%"
    };

    static defaultHeaderContainerStlye = {
        paddingLeft: 20
    };

    static defaultTransitionDefaultStyle = {
        transform: "translateY(-100%)"
    };

    static defaultTransitionEnterStyle = {
        transform: transit("translateY(0%)", 500, "ease")
    };

    static defaultTransitionActiveStyle = {

    };

    overlayStyle: Object;
    overlayClassName: string;
    handleOverlayClick: () => void;
    handleContainerClick: () => void;
    
    state: {heightOverflow: boolean};
    instanceWithHeightTrouble: any;

    constructor(props: propsTypes){
        super(props);
        this.overlayStyle = Object.assign({}, AbPopup.defaultOverlayStyle, this.props.overlayStyle, !this.props.open ? {display: "none"} : null); 
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.handleContainerClick = this.handleContainerClick.bind(this);
        this.state = {heightOverflow: false};    
    }

    componentWillReceiveProps(nextProps: propsTypes){
        if(!nextProps.open && this.props.open){
            this.setState({heightOverflow: false});
        }
    }

    componentWillUpdate(nextProps: propsTypes){
        if(nextProps.open !== this.props.open || nextProps.overlayStyle !== this.props.overlayStyle){           
            this.overlayStyle = Object.assign({}, AbPopup.defaultOverlayStyle, this.props.overlayStyle, !nextProps.open ? {display: "none"} : null);          
        }        
    }

   setHeightOverflowIfApplicable(innerContainerInstance: any, outerContainerInstance: any){
        let innerHeight = innerContainerInstance && innerContainerInstance.clientHeight;
        let outerHeight = outerContainerInstance && outerContainerInstance.clientHeight;
              
        if(innerHeight && outerHeight && innerHeight > outerHeight){
              this.setState({heightOverflow: true});
        }       
    }

    addResizeListener(heightInstance: any){       
        if(this.instanceWithHeightTrouble){
            removeResizeListener(this.instanceWithHeightTrouble, this.overlayInst);
            this.instanceWithHeightTrouble = null;
            
        }
        
        if(heightInstance){
            this.instanceWithHeightTrouble = heightInstance;
            addResizeListener(this.instanceWithHeightTrouble, (() => {
                this.setHeightOverflowIfApplicable(this.instanceWithHeightTrouble, this.overlayInst);
            }).bind(this));
        }
    }
    
    handleOverlayClick(){
        this.props.onHidePopup && this.props.onHidePopup();
    }

    handleContainerClick(e: any){
        e.stopPropagation();        
    }

    render() {
        const {open, header, footer, width, onHidePopup, overlayStyle, containerStyle, appHeight, transitionDefaultStyle, transitionEnterStyle, transitionActiveStyle, children, ...other} = this.props;
        
        let transitionContainerStyle = Object.assign({}, AbPopup.defaultTransitionContainerStyle, width ? {width: width} : null);
        let accContainerStyle = styleBuilder(AbPopup.defaultContainerStyle, containerStyle, "abPopup.container");

        let innerOuterContainerStyle = Object.assign({}, AbPopup.defaultInnerOuterContainerStyle);
        let innerContainerStyle = Object.assign({}, AbPopup.defaultInnerContainerStyle);

        if(this.state.heightOverflow){
            transitionContainerStyle.height = '100%';
            accContainerStyle.height = '100%';
            innerOuterContainerStyle.height = '100%';
            innerContainerStyle.height = '100%'; 
        }        
        
        return (
            <div style={this.overlayStyle} onTouchTap={this.handleOverlayClick}>
                <div style={AbPopup.defaultOverlayInnerStyle} ref={(overlayInst) => {this.overlayInst = overlayInst;}}>                    
                    <CSSTransition
                        style={transitionContainerStyle}                          
                        defaultStyle={transitionDefaultStyle || AbPopup.defaultTransitionDefaultStyle}
                        enterStyle={transitionEnterStyle || AbPopup.defaultTransitionEnterStyle}
                        activeStyle={transitionActiveStyle || AbPopup.defaultTransitionActiveStyle}
                        active={open}
                        {...other}
                    >
                        {(() => {
                            if(open){
                            return (
                                <div style={accContainerStyle} key={1} onTouchTap={this.handleContainerClick} ref={(heightTroubleInst => {this.addResizeListener(heightTroubleInst)})}>
                                    <div style={AbPopup.defaultHeaderContainerStlye}>
                                        {header ? header : null}
                                    </div>
                                    <div style={innerOuterContainerStyle}>                            
                                        <div style={innerContainerStyle} className='abpopup-from-flex-with-padding'>
                                            <div style={AbPopup.defaultOverflowContainerStyle} className='abpopup-from-flex-with-padding'>
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                    {footer ? footer : null}
                                </div>
                                );
                            }
                        })()}
                    </CSSTransition>                    
                </div>
            </div>
        );
    }
}

AbPopup.propTypes = {
    open: PropTypes.bool.isRequired,    
    header: PropTypes.node,
    footer: PropTypes.node,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.node,
    onHidePopup: PropTypes.func,
    overlayStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    appHeight: PropTypes.number,
    transitionDefaultStyle: PropTypes.object,
    transitionEnterStyle: PropTypes.object,
    transitionActiveStyle: PropTypes.object
};

type propsTypes = {
    open: boolean,    
    header?: ?React$Element<any>,
    footer?: ?React$Element<any>,
    width?: ?number | ?string,
    children: React$Element<any>,
    onHidePopup: () => void,
    overlayStyle?: ?Object,
    containerStyle?: ?Object,
    appHeight: number,
    transitionDefaultStyle?: ?Object,
    transitionEnterStyle?: ?Object,
    transitionActiveStyle?: ?Object
};

export default AbPopup;