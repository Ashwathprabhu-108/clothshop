import React from 'react'
import "./NewsLetter.css"

const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Ask Questions or Add Suggestions</h1>
        <div>
            <input type="text" placeholder='Type Here' />
            <button>Submit</button>
        </div>
    </div>
  )
}

export default NewsLetter