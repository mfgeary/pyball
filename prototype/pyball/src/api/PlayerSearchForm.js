import Downshift from "downshift";
import React from "react";

/**
 * Hook to define a form for searching for a player using a dropdown list that is autopopulated
 * based on API results for the search query.
 * @author Claire Wagner
 * @author Marion Geary
 * @param query The query state.
 * @param setQuery The function to use to modify the query state.
 * @param buttonText The text to display on the button.
 * @param onFail The function to call if the search query is submitted and fails the validity checks
 * (this function will be passed a string describing the error that occurred).
 * @param onPass The function to call if the search query is submitted and passes the validity checks.
 * @returns The form.
 */
export function AutocompletePlayerSearchForm({query, setQuery, buttonText, onFail, onPass}) {

  function handleQuery(query, onFail, onPass) {
    if (query === '') {
      onFail('Error: please enter a name. ');
    } else if (query.split(' ').length < 2) {
      onFail('Error: please enter both first and last name of player.');
    } else if (query.split(' ').length > 2) {
      onFail('Error: please enter only first and last name of player.');
    } else {
      onPass(query);
    }
  };

  const PlayerList = require('./PlayerList.json');

  return(
    <Downshift
      onChange={(selection) => {
        setQuery(selection.full_name);
      }}
      
      itemToString={item => (item ? item.value : '')}
    >
    {({
      getInputProps,
      getItemProps,
      getMenuProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
      closeMenu,
    }) => (
      <div>
        
        <div style={{ display: 'flex', flexDirection: 'row' }}>
        <form style={{ display: 'flex', flexDirection: 'row' }} onSubmit={(event) => {
        event.preventDefault();
        handleQuery(query, onFail, onPass);
      }}>
        <input {...getInputProps({ 
          placeholder: "Enter player name",
          type: "text",
          value: query,
          onChange: (e) => {
            setQuery(e.target.value);
          },
          onSubmit: (e) => {
            console.log(query);
          }
        })} />
      <button onClick={(event) => {
        event.preventDefault();
        isOpen && closeMenu(); // close autocomplete menu if open
        handleQuery(query, onFail, onPass);
      }} type='submit'>
        {buttonText}
      </button>
      </form>
        </div>
        <ul {...getMenuProps({ style: {listStyle: 'none'} })}>
          {isOpen && query !== ''
            ? PlayerList
                .filter(item => !inputValue ||
                    // case-insensitive matching
                    item.full_name.toLowerCase().includes(inputValue.toLowerCase()))
                .map((item, index) => (
                  <li
                    {...getItemProps({
                      key: item.full_name,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {item.full_name}
                  </li>
                ))
            : null}
        </ul>
      </div>
    )}
  </Downshift>
    )
}

/**
 * Hook to define a form for searching for a player.
 * @author Claire Wagner
 * @param query The query state.
 * @param setQuery The function to use to modify the query state.
 * @param buttonText The text to display on the button.
 * @param onFail The function to call if the search query is submitted and fails the validity checks
 * (this function will be passed a string describing the error that occurred).
 * @param onPass The function to call if the search query is submitted and passes the validity checks.
 * @returns The form.
 */
 export function PlayerSearchForm({query, setQuery, buttonText, onFail, onPass}) {

  /**
   * Helper function to handle queries, including basic validity checks.
   * Postcondition: If a query is detected as invalid, onError has been called;
   * otherwise, onPass has been called.
   */
  function handleQuery(query, onFail, onPass) {
    if (query === '') {
      onFail('Error: please enter a name.');
    } else if (query.split(' ').length < 2) {
      onFail('Error: please enter both first and last name of player.');
    } else if (query.split(' ').length > 2) {
      onFail('Error: please enter only first and last name of player.');
    } else {
      onPass();
    }
  };

  return (
    <form style={{display: 'flex', flexDirection: 'row'}}>
      <input
        type='text'
        placeholder='Enter player name'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={(event) => {
        event.preventDefault();
        handleQuery(query, onFail, onPass);
      }}>
        {buttonText}
      </button>
    </form>
  );
}