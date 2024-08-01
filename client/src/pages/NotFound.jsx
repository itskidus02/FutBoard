import React from 'react'
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className='mt-40 flex flex-col gap-3 justify-center items-center '> 
    
    
    <span className='text-4xl'>ፎሮፎር </span>
     <button className='ring-2 ring-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded'>
          <Link to="/">Home</Link>
        </button>
    
    
    
    </div>
  )
}

export default NotFound