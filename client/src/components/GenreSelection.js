import './GenreSelection.css';

function GenreSelection() {
  return (
    <div className='GenreSelection'>
      <nav className="navbar">
        <div className="navbar-container">
          <h3 className="logo">Melodypalette</h3>
          <div className='navbar-box'>
            <ul>
              <li><a href="#section1">제목 또는 아티스트 검색</a></li>
              <li><a href="#section2">실시간 top 랭킹</a></li>
              <li><a href="#section3">Playlist</a></li>
              <li><a href="#section4">프로필</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <div className='select-container'>
        <h1 className='page-title'>선호하는 장르</h1>
      </div>
      
    </div>
  );
}

export default GenreSelection;