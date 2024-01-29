import { useState } from "react"

export default function SearchBar({ searchBarSubmitCallback }) {
    const [userInput, setUserInput] = useState("")

    return (
        <div style={{display: 'flex' }} className="search-bar">
            <input className="search-bar-input" placeholder='Enter keywords...' value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
            <button onClick={() => searchBarSubmitCallback(userInput)}>Submit</button>
        </div>
    )
}