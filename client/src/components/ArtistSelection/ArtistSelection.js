import './ArtistSelection.css';
import { useState } from 'react';

function ArtistSelection() {
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

//아티스트 이미지 선택하거나 해제할 때
const toggleSelectArtist = (artistId) => {
  if (selectedArtists.includes(artistId)) {
    setSelectedArtists((prevSelected) =>
      prevSelected.filter((id) => id !== artistId)
    );
    setErrorMessage(''); 
  } else {
    if (selectedArtists.length < 5) {
      setSelectedArtists((prevSelected) => [...prevSelected, artistId]);
      setErrorMessage(''); 
    } else {
      setErrorMessage('최대 5개의 아티스트만 선택할 수 있습니다.'); 
    }
  }
};
 //아티스트 데이터
  const artists = [
    { id: 1, name: 'Newjeans', imageUrl: 'https://cdn.mediatoday.co.kr/news/photo/202311/313885_438531_4716.jpg' },
    { id: 2, name: 'KISS OF LIFE', imageUrl: 'https://newsimg-hams.hankookilbo.com/2023/09/28/6829b876-f7dc-4cec-ac6b-3848aedb6893.jpg' },
    { id: 3, name: 'THE BOYZ', imageUrl: 'https://cdn.m-i.kr/news/photo/202308/1037865_801651_2133.jpg' },
    { id: 4, name: 'aespa', imageUrl: 'https://isplus.com/data/isp/image/2024/05/27/isp20240527000067.800x.0.jpg' },
    { id: 5, name: '(여자)아이들', imageUrl: 'https://cdn.k-trendynews.com/news/photo/202401/164775_247502_4938.png' },
    { id: 6, name: 'RIIZE', imageUrl: 'https://images.chosun.com/resizer/zkOR-Z3t05y6kOUpeHe0wfuhXW0=/616x0/smart/cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/2FRA4M6BJJCUYKF3VPBMNLGUSQ.jpg' },
    { id: 7, name: 'NMIXX', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMno7zrpmdOJ0POYFPtkNj4EUo4BEwmiwlPQ&s' },
    { id: 8, name: '투모로우바이투게더', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1GaPNo97asOlXnaMYmWul-Io-F4kBkMS3Dg&s' },
    { id: 9, name: 'IVE', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5F68Yz6R5suesCX77P__tgYA3EWctrHOQzw&s' },
    { id: 10, name: 'NCT DREAM', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVB5bYIy6k7saYWOuenHmrfT1Mnh4RxDdKgg&s' },
    { id: 11, name: 'Seventeen', imageUrl: 'https://biz.chosun.com/resizer/lfSXaKhI5Lkq4yl0gkxe6RVXbL8=/530x756/smart/cloudfront-ap-northeast-1.images.arcpublishing.com/chosunbiz/JF66Z5OQVYWPZHPRBQ5NK67OPQ.jpg' },
    { id: 12, name: 'BLACKPINK', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pLuRvRzLX0QVsO8Imir6kY6SWsjuDDQsYQ&s' },

  ];

  return (
    <div className='ArtistSelection'>
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
        <h1 className='page-title'>선호하는 아티스트</h1>
        <div className='select-complete'>
          <span className='select-limit'>최대 5개 이하 선택</span>
          <button className='select-complete-btn'>선택 완료</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className='select-list'>
          {artists.map((artist) => (
            <div
              key={artist.id}
              className={`artist-item ${selectedArtists.includes(artist.id) ? 'selected' : ''}`}
              onClick={() => toggleSelectArtist(artist.id)}
            >
              <div className='artist-image-container'>
                <img src={artist.imageUrl} alt={artist.name} className='artist-image' />
              </div>
              <p className='artist-name'>{artist.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtistSelection;
