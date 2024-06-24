import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './Main/Main';
import SearchResult from './SearchResult/SearchResult';
import Recommendation from './Recommendation/Recommendation';
import ArtistSelection from './ArtistSelection/ArtistSelection'; 
import GenreSelection from './GenreSelection/GenreSelection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/artists" element={<ArtistSelection />} />
        <Route path="/genres" element={<GenreSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
