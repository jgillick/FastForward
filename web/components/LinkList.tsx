import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link'

import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { withApollo } from '../apollo/client';
import { LINKS_QUERY } from '../apollo/queries';

import { AuthContext } from './Authenticated';
import SearchField from './SearchField';

import css from './LinkList.module.scss';

function LinkList() {
  const { oAuthIdToken } = useContext(AuthContext);
  const { loading, error, data, refetch } = useQuery(LINKS_QUERY, {
    variables: { oAuthIdToken },
  });
  const links = (data) ? data.links : [];

  /**
   * The search query has changed.
   */
  function onQueryChanged(query) {
    refetch({
      query,
      oAuthIdToken,
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      {/* Error */}
      { error && (
        <Alert severity="error" variant="filled">
          {error?.message || error}
        </Alert>
      )}

      {/* Search box */}
      {Boolean(links.length) && (
        <SearchField onQueryChanged={onQueryChanged} />
      )}

      {/* Loading indicator */}
      { loading && <LinearProgress color="secondary" />}

      {/* List */}
      {Boolean(links.length) && (
        <List className={css.list}>
          {links.map(link => (
            <Link
              key={link.name}
              href="/_/links/[name]"
              as={`/_/links/${link.name}`}
            >
              <a className={css.listLink}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={link.user.name} src={link.user.picture} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={link.name}
                    secondary={link.url}
                    secondaryTypographyProps={{
                      className: css.urlDisplay
                    }}
                  />
                </ListItem>
              </a>
            </Link>
          ))}
        </List>
      )}

      {/* No results */}
      {Boolean(!links.length) && (
        <div className={css.emptyState}>
          <Link href="/">
            <a>
              Add your first link!
            </a>
          </Link>
        </div>
      )}
    </Container>
  );
}

export default withApollo(LinkList);
