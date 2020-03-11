import { useState, useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/HighlightOff';

import css from './SearchField.module.scss';

export default function SearchField({ onQueryChanged }) {
  const [ query, setQuery ] = useState('');

  /**
   * Call onQueryChanged when the query changes
   */
  useEffect(() => {
    if (typeof onQueryChanged !== 'function') {
      return;
    }

    // Debounce the change updates
    const timer = setTimeout(() => {
      onQueryChanged(query);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [ query ]);

  return (
    <Paper>
      <label className={css.searchRow}>
        <SearchIcon className={css.searchIcon} />
        <InputBase
          className={css.field}
          placeholder="Search"
          inputProps={{ 'aria-label': 'Search links' }}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query !== '' && (
          <IconButton
            aria-label="clear search"
            className={css.clearIcon}
            onClick={() => setQuery('')}
          >
            <ClearIcon />
          </IconButton>
        )}
      </label>
    </Paper>
  );
}
