import {useState, useRef, useEffect} from 'react';
import {createPortal} from 'react-dom';

function copyStyles(src, dest) {
    Array.from(src.styleSheets).forEach(styleSheet => {
        dest.head.appendChild(styleSheet.ownerNode.cloneNode(true))
    })
    Array.from(src.fonts).forEach(font => dest.fonts.add(font))
}

export default function ReactWindow(props){
    const [container, setContainer] = useState(null);
    const newWindow = useRef(null);
  
    useEffect(() => {
      // Create container element on client-side
      setContainer(document.createElement("div"));
    }, []);
  
    useEffect(() => {
      // When container is ready
      if (container) {
        // Create window
        newWindow.current = window.open(
          "",
          "",
          "width=600,height=400,left=200,top=200"
        );
        // Append container
        newWindow.current.document.body.appendChild(container);
  
        // Save reference to window for cleanup
        const curWindow = newWindow.current;
        copyStyles(window.document, newWindow.current.document);
        curWindow.print();
        // Return cleanup function
        return () => curWindow.close();
      }
    }, [container]);
  
    return container && createPortal(props.children, container);
  };