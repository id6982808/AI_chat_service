
import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="bg-slate-200 w-screen h-screen flex items-center justify-center font-sans">
      <div className="w-full h-full sm:w-[400px] sm:h-[90vh] sm:max-h-[800px] bg-white rounded-lg shadow-2xl flex flex-col">
        <ChatInterface />
      </div>
    </div>
  );
};

export default App;
   