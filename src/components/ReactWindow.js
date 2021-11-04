import {useState, useRef, useEffect} from 'react';
import {createPortal} from 'react-dom';

function copyStyles(src, dest) {
    Array.from(src.styleSheets).forEach(styleSheet => {
        dest.head.appendChild(styleSheet.ownerNode.cloneNode(true))
    })
    Array.from(src.fonts).forEach(font => dest.fonts.add(font))
}

export default function ReactWindow({openWindow, ...props}){
    const [container, setContainer] = useState(null);
    const reactWindow = useRef(null);

    openWindow.current=(x, y, w, h)=>{
        if (!container) return;

        try {
            reactWindow.current.close(); 
        } catch {
        }

        const newWindow = window.open("","","width="+w+",height="+h+",left="+x+",top="+y);

        reactWindow.current=newWindow;
        reactWindow.current.document.body.appendChild(container);
        copyStyles(window.document, reactWindow.current.document);
    }

    useEffect(() => {
        setContainer(document.createElement("div"));
        return ()=>{
            try {
                reactWindow.current.close(); 
            } catch {
            }
        };
    }, []);

    return container && createPortal(props.children, container);
  };