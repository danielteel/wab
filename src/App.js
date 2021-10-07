import NumberPad from './components/NumberPad';
import React from 'react';

function App() {
    const [visible, setVisible] = React.useState(true);
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Edit
                    <code>src/App.js</code>
                    and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
            {
                visible
                ?
                    <NumberPad title="yolo" initialValue={69} saveAndClose={(v)=>console.log(v, setVisible(false))}/>
                :
                    null
            }
        </div>
    );
}

export default App;
