import React from 'react';
import ReactDOM from 'react-dom';
import './assets/fomantic/dist/semantic.min.css';
import './index.css';
import App from './App';


ReactDOM.render(
  <React.StrictMode>
    <App nameSpace='wab' key={"1"} />
    <App nameSpace='wab' key={"2"}/>
    <App nameSpace='wab' key={"3"}/>
  </React.StrictMode>,
  document.getElementById('root')
);