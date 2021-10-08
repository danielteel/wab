import React from 'react';
import styled from 'styled-components';

const PadModal = styled.div`
    -webkit-font-smoothing: antialiased;
    left: 0px;
    top: 0px;
    color: #fff;
    font-size: 0.875rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.43;
    letter-spacing: 0.01071em;
    touch-action: pan-x pan-y;
    box-sizing: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    outline: 0;
    opacity: 1;
    transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    touch-action: none;
    position: fixed;
    z-index: 1300;
    inset: 0px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

function drawButton(context, rect, x, y, w, h, text, pressed) {
    x=x*rect.width;
    y=y*rect.height;
    h=h*rect.height;
    w=w*rect.width;
    context.beginPath();
    context.lineJoin='round';
    context.lineWidth=1;
    context.fillStyle=pressed?'#D0D0D0':'#F0F0F0';
    context.moveTo(x,y);
    context.lineTo(x+w,y);
    context.lineTo(x+w,y+h);
    context.lineTo(x, y+h);
    context.closePath();
    context.fill();
    context.stroke();
    context.font=Math.min(w,h)/2+"px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillStyle='#111';
    context.fillText(text,x+w/2,y+h/2)
}
function drawText(context, rect, x, y, w, h, bgColor, color, text) {
    x=x*rect.width;
    y=y*rect.height;
    h=h*rect.height;
    w=w*rect.width;
    context.beginPath();
    context.lineJoin='round';
    context.lineWidth=1;
    context.fillStyle=bgColor;
    context.moveTo(x,y);
    context.lineTo(x+w,y);
    context.lineTo(x+w,y+h);
    context.lineTo(x, y+h);
    context.closePath();
    context.fill();
    context.stroke();
    context.font=Math.min(w,h)/2+"px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillStyle=color;
    context.fillText(text,x+w/2,y+h/2)
}

export default class NumberPad extends React.Component {
    constructor(props){
        super(props);
        this.state={width: document.body.clientWidth, height: document.body.clientHeight};
        this.touch={};
        this.scratchpad=isFinite(props.initialValue)?props.initialValue:0;
        this.canvasRef = React.createRef();

        this.mounted=true;

        this.ui=[
            {type: 'text',   x: 0   , y: 0.0,  w: 1,   h: 0.08, bgColor: "#222",    color: "#FFF", text: () => this.props.title },
            {type: 'text',   x: 0   , y: 0.08, w: 1,   h: 0.12, bgColor: "#FFFFFF", color: "#000", text: () => this.scratchpad },
     
            {type: 'button', x: 0   , y: 0.2,  w: .25, h: 0.2, text: "7",   click: this.addDigit},
            {type: 'button', x: 0.25, y: 0.2,  w: .25, h: 0.2, text: "8",   click: this.addDigit},
            {type: 'button', x: 0.5 , y: 0.2,  w: .25, h: 0.2, text: "9",   click: this.addDigit},
            {type: 'button', x: 0.75, y: 0.2,  w: .25, h: 0.2, text: "Clr", click: this.clearClicked},
    
            {type: 'button', x: 0   , y: 0.4,  w: .25, h: 0.2, text: "4",   click: this.addDigit},
            {type: 'button', x: 0.25, y: 0.4,  w: .25, h: 0.2, text: "5",   click: this.addDigit},
            {type: 'button', x: 0.5 , y: 0.4,  w: .25, h: 0.2, text: "6",   click: this.addDigit},
            {type: 'button', x: 0.75, y: 0.4,  w: .25, h: 0.2, text: "<",   click: this.backClicked},
    
            {type: 'button', x: 0   , y: 0.6,  w: .25, h: 0.2, text: "1",   click: this.addDigit},
            {type: 'button', x: 0.25, y: 0.6,  w: .25, h: 0.2, text: "2",   click: this.addDigit},
            {type: 'button', x: 0.5 , y: 0.6,  w: .25, h: 0.2, text: "3",   click: this.addDigit},
            {type: 'button', x: 0.75, y: 0.6,  w: .25, h: 0.4, text: "Ok",  click: this.okClicked},
    
            {type: 'button', x: 0   , y: 0.8,  w: .25, h: 0.2, text: "-",   click: this.minusClicked},
            {type: 'button', x: 0.25, y: 0.8,  w: .25, h: 0.2, text: "0",   click: this.addDigit},
            {type: 'button', x: 0.5 , y: 0.8,  w: .25, h: 0.2, text: ".",   click: this.addDigit},
        ];
    }

    redraw = () => {
        if (!this.mounted) return;
        
        const rect=this.canvasRef.current.getBoundingClientRect();
        const context = this.canvasRef.current.getContext('2d')

        context.fillStyle = '#C0C0C0';
        context.fillRect(0, 0, rect.width, rect.height);

        for (const element of this.ui){
            if (element.type==="button"){
                drawButton(context, rect, element.x, element.y, element.w, element.h, element.text, false);
            }else if (element.type==='text'){
                drawText(context, rect, element.x, element.y, element.w, element.h, element.bgColor, element.color, element.text());
            }
        }

        if (this.touch.element){
            drawButton(context, rect, this.touch.element.x, this.touch.element.y, this.touch.element.w, this.touch.element.h, this.touch.element.text, this.touch.element.pressed);
        }
    }

    updateDigits = (newDigits) => {
        if (newDigits==="") newDigits="0";
        this.scratchpad=newDigits;
        this.redraw();
    }
    
    addDigit = (dig) => {
        const digits=String(this.scratchpad);
        if (digits.indexOf(".")>=0 && dig===".") return;
        if (digits==="0" && dig==="0") return;
        if (digits==="0" && dig!=="0"){
            this.updateDigits(dig)
        }else{
            this.updateDigits(digits+dig);
        }
    }
    
    minusClicked = () => {
        const digits=String(this.scratchpad);
        if (digits==="0"){
            this.updateDigits("-");
        }else{
            if (digits[0]==="-"){
                this.updateDigits(digits.substr(1));
            }else{
                this.updateDigits("-"+digits);
            }
        }
    }
    
    okClicked = () => {
        let returnVal=Number(this.scratchpad);
        if (!isFinite(returnVal)) returnVal=0;
        this.redraw();
        this.props.saveAndClose(String(returnVal));
    }
    
    clearClicked = () => this.updateDigits("0")

    backClicked = () => {
        const digits=String(this.scratchpad);
        this.updateDigits(digits.substr(0, digits.length-1));
    }

    touchStart = (e) => {
        const rect=e.target.getBoundingClientRect();
        const mX=(e.touches[0].clientX-rect.x)/rect.width;
        const mY=(e.touches[0].clientY-rect.y)/rect.height;
        let elementClicked=null;
        for (const element of this.ui){
            if (element.type==="button"){
                if (mX>=element.x && mX<=element.x+element.w && mY>=element.y && mY<=element.y+element.h){
                    elementClicked=element;
                    elementClicked.pressed=true;
                    break;
                }
            }
        }
        this.touch = {element: elementClicked, x: mX, y: mY};
        this.redraw();
    }
    touchMove = (e) => {
        const rect=e.target.getBoundingClientRect();
        const mX=(e.changedTouches[0].clientX-rect.x)/rect.width;
        const mY=(e.changedTouches[0].clientY-rect.y)/rect.height;

        if (this.touch.element){
            this.touch.element.pressed=(mX>=this.touch.element.x && mX<=this.touch.element.x+this.touch.element.w && mY>=this.touch.element.y && mY<=this.touch.element.y+this.touch.element.h);
        }

        this.touch = {element: this.touch.element, x: mX, y: mY};
        this.redraw();
    }
    touchEnd = (e) => {
      e.preventDefault();
        const rect=e.target.getBoundingClientRect();
        const mX=(e.changedTouches[0].clientX-rect.x)/rect.width;
        const mY=(e.changedTouches[0].clientY-rect.y)/rect.height;

        if (this.touch.element){
            if (mX>=this.touch.element.x && mX<=this.touch.element.x+this.touch.element.w && mY>=this.touch.element.y && mY<=this.touch.element.y+this.touch.element.h){
                this.touch.element.click(this.touch.element.text);
            }
        }

        this.touch = {element: null, x: mX, y: mY};
        this.redraw();
    }

    onClick = (e) => {
        const rect=e.target.getBoundingClientRect();
        const mX=(e.clientX-rect.x)/rect.width;
        const mY=(e.clientY-rect.y)/rect.height;
        for (const element of this.ui){
            if (element.type==="button"){
                if (mX>=element.x && mX<=element.x+element.w && mY>=element.y && mY<=element.y+element.h){
                    element.click(element.text);
                    element.pressed=true;
                    this.touch={element: element, x: mX, y: mY};
                    setTimeout(()=>{
                        this.touch={element: null, x: mX, y: mY};
                        this.redraw();
                    },50)
                    break;
                }
            }
        }
        this.redraw();
    }

    resize = () => {
        this.setState({width: document.body.clientWidth, height: document.body.clientHeight});
        this.redraw();
    }

    componentDidMount = () => {
        window.addEventListener('resize', this.resize);
        this.redraw();
    }

    componentWillUnmount = () => {
        this.mounted=false;
        window.removeEventListener('resize', this.resize);
    }
    
    render = () => {
        return (
                <PadModal>
                    <canvas ref={this.canvasRef} style={{left: 0, top: 0, width: this.state.width, height: this.state.height}} width={this.state.width} height={this.state.height}
                        onClick={this.onClick} onTouchMove={this.touchMove} onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>Canvas not supported</canvas>
                </PadModal>
        );
    }
}