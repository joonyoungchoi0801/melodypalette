import './GenreSelection.css';
import { useState } from 'react';

function GenreSelection() {
  const [selectGenres, setSelectGenres] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSelectGenre = (genreId) => {
    if(selectGenres.includes(genreId)){
      setSelectGenres((preSelected) => 
        preSelected.filter((id) =>id !== genreId)
      );
      setErrorMessage('');
    }else {
      if(selectGenres.length < 5){
        setSelectGenres((preSelected) => [...preSelected, genreId]);
        setErrorMessage('');
      } else {
        setErrorMessage('최대 5개의 장르만 선택할 수 있습니다.');
      }
    }
  };

  //장르 데이터
  const genres = [
    { id: 1, name: 'Pop', imageUrl: 'https://cdn.pixabay.com/photo/2017/12/04/17/48/michael-jackson-2997510_1280.jpg' },
    { id: 2, name: 'Rock', imageUrl: 'https://cdn.pixabay.com/photo/2015/09/25/23/11/festival-958414_1280.jpg' },
    { id: 3, name: 'Hip Hop', imageUrl: 'https://cdn.pixabay.com/photo/2017/09/09/19/23/hiphop-2733136_1280.jpg' },
    { id: 4, name: 'Jazz', imageUrl: 'https://cdn.pixabay.com/photo/2013/10/22/23/21/jazz-199547_1280.jpg' },
    { id: 5, name: 'Classical', imageUrl: 'https://cdn.pixabay.com/photo/2016/07/02/21/05/piano-1493797_1280.jpg' },
    { id: 6, name: 'EDM', imageUrl: 'https://cdn.pixabay.com/photo/2018/06/10/11/38/festival-3466251_1280.jpg' },
    { id: 7, name: 'R&B', imageUrl: 'https://cdn.pixabay.com/photo/2014/11/21/16/43/singer-540771_1280.jpg' },
    { id: 8, name: '어쿠스틱', imageUrl: 'https://cdn.pixabay.com/photo/2017/05/01/18/18/guitar-2276181_1280.jpg' },
    { id: 9, name: '밴드', imageUrl: 'https://cdn.pixabay.com/photo/2023/01/29/00/16/drums-7751985_1280.jpg' },
    { id: 10, name: 'OST', imageUrl: 'https://cdn.pixabay.com/photo/2019/05/23/13/11/headphones-4223911_1280.jpg' },
    { id: 11, name: '댄스', imageUrl: 'https://cdn.pixabay.com/photo/2014/08/29/05/00/dance-430554_1280.jpg' },
    { id: 12, name: '트로트', imageUrl: 'https://cdn.pixabay.com/photo/2018/05/24/14/35/disco-ball-3426765_1280.jpg' },
  ];

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
        <div className='select-complete'>
          <span className='select-limit'>최대 5개 이하 선택</span>
          <button className='select-complete-btn'>선택 완료</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className='select-list'>
          {genres.map((genre) => (
            <div
              key={genre.id}
              className={`genre-item ${selectGenres.includes(genre.id) ? 'selected' : ''}`}
              onClick={() => toggleSelectGenre(genre.id)}
            >
              <div className='genre-image-container'>
                <img src={genre.imageUrl} alt={genre.name} className='genre-image' />
              </div>
              <p className='genre-name'>{genre.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenreSelection;