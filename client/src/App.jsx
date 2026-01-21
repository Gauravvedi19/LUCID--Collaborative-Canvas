import React, { useState } from 'react';
import CanvasBoard from './components/CanvasBoard';
import LandingPage from './components/LandingPage';

function App() {
  const [user, setUser] = useState(null); 

  if (!user) {
    return <LandingPage onJoin={(name) => setUser({ name })} />;
  }

  return (
    <CanvasBoard userName={user.name} />
  );
}

export default App;