import React from 'react'

const Filter = ({ query, handleSearchChange }) => {
  return (
    <div>
                Filter shown with: <input type="text" value={query} onChange={handleSearchChange} />
    </div>
  )
}

export default Filter