import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link'
import gql from 'graphql-tag'

import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { AuthContext } from './Authenticated';
import { withApollo } from '../apollo/client';

import css from './LinkList.module.scss';

const LINKS_QUERY = gql`
  query LinksQuery(
    $oAuthIdToken: String!,
  ) {
    links(oAuthIdToken: $oAuthIdToken) {
      name
      url
      createdAt
      user {
        name
        picture
      }
    }
  }
`

function LinkList() {
  const { oAuthIdToken } = useContext(AuthContext);
  const { loading, error, data } = useQuery(LINKS_QUERY, {
    variables: { oAuthIdToken },
  });
  const links = (data) ? data.links : [];

  return (
    <Container component="main" maxWidth="xs">
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
                <ListItemText primary={link.name} secondary={link.url}>
                </ListItemText>
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
      { loading && (
        <LinearProgress />
      )}
      { error && (
        <Alert severity="error" variant="filled">
          {error?.message || error}
        </Alert>
      )}
    </Container>
  );
}

export default withApollo(LinkList);
