import { useEffect } from 'react';
import './App.css';

function App() {

  useEffect(() => {
    console.log('postMessage')
    const frame = document.getElementById('rewind-iframe');
    frame.contentWindow.postMessage({message: 'HELLO_WORLD'}, 'https://casino.demo.rewindprotocol.com');
  
  }, [])

  return (
    <div className="App" >
        <div>IFRAME_START</div>
        <iframe
          title="Child iframe"
          id={"rewind-iframe"}
          frameBorder="0"
          src={`https://casino.demo.rewindprotocol.com/app/iframe?theme=BLUE_DARK&isMobileResponsive=true&sid=cd050c6c-f1ea-4f65-94c7-ac29e6e82d34&foreignId=u119006797652`}
        ></iframe>
        <div>IFRAME_END</div>
    </div>
  );
}

export default App;
