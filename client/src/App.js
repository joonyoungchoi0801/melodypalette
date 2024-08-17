import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Main from './components/Main/Main';
import SearchResult from './components/SearchResult/SearchResult';
import Recommendation from './components/Recommendation/Recommendation';
import ArtistSelection from './components/ArtistSelection/ArtistSelection'; 
import GenreSelection from './components/GenreSelection/GenreSelection';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/artists" element={<ArtistSelection />} />
          <Route path="/genres" element={<GenreSelection />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
