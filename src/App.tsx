import React from 'react';
import ArtGallery from './components/ArtGallery';

const App: React.FC = () => {
  return (
    <div className="App">
      <h2 className="text-2xl font-bold mb-4">Art Gallery</h2>
      <ArtGallery />
    </div>
  );
};

export default App;
