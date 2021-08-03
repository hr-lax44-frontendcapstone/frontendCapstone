import React, { useState, useEffect } from 'react'

function SearchBar(props){

  function getSearchPhrase(event){
    props.searchHandler(event.target.value)
  }

  return(
    <div id="SearchBar" >
      <input
        type='text'
        placeholder='HAVE A QUESTION? SEARCH FOR ANSWERS...'
        value={props.searchPhrase}
        onChange={getSearchPhrase}
      />
    </div>
  )
}

export default SearchBar;
