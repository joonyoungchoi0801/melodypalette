import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Main from './components/Main/Main';
import SearchResult from './components/SearchResult/SearchResult';
import RecommendationOptions from './components/RecommendationOptions/RecommendationOptions';
import ArtistSelection from './components/ArtistSelection/ArtistSelection'; 
import GenreSelection from './components/GenreSelection/GenreSelection';
import Callback from '../src/components/Callback/Callback';
import Recommendation from './components/Recommendation/Recommendation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/RecommendationOptions" element={<RecommendationOptions />} />
          <Route path="/artists" element={<ArtistSelection />} />
          <Route path="/genres" element={<GenreSelection />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/recommendations" element={<Recommendation />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
