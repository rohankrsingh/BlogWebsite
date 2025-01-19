import React from 'react'

function Logo({width = '100px'}, {className} ) {
  return (
    <h1 className={`text-2xl ${className}`}>Logo</h1>
  )
}

export default Logo