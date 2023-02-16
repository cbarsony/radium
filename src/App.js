import { useEffect, useState } from 'react'
import './App.css'
import LoginButton from './LoginButton'
import Profile from './Profile'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton';

function App() {
  const [searchText, setSearchText] = useState('wire')
  const [suggestions, setSuggestions] = useState([])

  const { user, isAuthenticated, isLoading } = useAuth0();

  const getThumbnail = originalImgSrc => {
    return originalImgSrc.substring(0, originalImgSrc.length - 7) + 'V1._SX100_SY100_.jpg'
  }

  /* useEffect(() => {
    fetch('/api/hello')
        .then(response => response.json())
        .then(data => console.log({data}))
        .catch(error => console.warn(error))
  }, [searchText]) */

  const onSearchClick = () => {
    if(searchText !== '') {
      fetch(`https://v2.sg.media-imdb.com/suggests/h/${searchText}.json`)
        .then(response => response.text())
        .then(data => {
          const firstBracket = data.search(/\(/)
          console.log({firstBracket})
          const result = data.substring(firstBracket + 1, data.length - 1)
          const suggestions = JSON.parse(result).d
          console.log(suggestions)
          setSuggestions(suggestions)
        })
        .catch(error => console.warn(error))
    }
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <Profile />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
      <input
        type="text"
        onChange={e => setSearchText(e.target.value)}
        value={searchText}
      />
      <button
        onClick={onSearchClick}
      >Search</button>
      <div>
        {suggestions ? suggestions.filter(s => s.i && s.id && s.l).map(suggestion => (
          <div key={suggestion.id}>
            <a href={`https://www.imdb.com/title/${suggestion.id}/`}>{suggestion.l}</a>
            <img src={getThumbnail(suggestion.i[0])} alt={suggestion.l} />
            <button>Add</button>
          </div>
        )) : (
          <div>no results...</div>
        )}
      </div>
    </div>
  )
}

export default App
