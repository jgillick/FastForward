import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import gql from 'graphql-tag'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { withApollo } from '../../../apollo/client';
import ViewEditUrl from '../../../components/ViewEditUrl'
import Chart from '../../../components/Chart'

import css from './[name].module.scss';

const LINK_QUERY = gql`
  query LinksQuery(
    $name: String!,
  ) {
    link(
      name: $name,
    ) {
      name
      url
      updatedAt
      user {
        name
        picture
      }
      history {
        id
        url
        createdAt
        user {
          name
          picture
        }
      }
    }
  }
`;

export default withApollo(function LinkDetails() {
  const router = useRouter();
  const { name } = router.query;
  const { loading, error, data, refetch } = useQuery(LINK_QUERY, {
    variables: { name },
  });
  const link = data?.link;
  const history = link?.history || [];

  const utcDate = (time) => new Date(new Date(time).toISOString());
  const relativeTime = (time) => formatDistanceToNow(utcDate(time), { addSuffix: true })

  // Sort history
  if (history && history.length > 1) {
    history.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return (
    <Container component="main" maxWidth="sm">
      <Typography variant="h1">
        {name}
      </Typography>

      {/* Loading */}
      { loading && (
        <LinearProgress />
      )}

      {/* Error */}
      { error && (
        <Alert severity="error" variant="filled">
          Couldn't find that link.
        </Alert>
      )}

      {/* Details */}
      { link && (
        <>
          {/* Edit URL */}
          <ViewEditUrl link={link} onChange={refetch} className={css.url} />

          {/* Chart */}
          <Paper elevation={3} className={css.chart}>
            <Typography variant="h1">
              Redirects
            </Typography>
            <Chart name={link.name} />
          </Paper>

          {/* Details */}
          <Paper elevation={3} className={css.history}>
            <Typography variant="h1">
              Change History
            </Typography>
            <List>
              {history.map((rev, i) => (
                <ListItem
                  key={rev.id}
                  className={(i === 0) ? css.currentRev : css.pastRev}
                >
                  <ListItemAvatar>
                    <Avatar alt={rev.user.name} src={rev.user.picture} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={relativeTime(rev.createdAt)}
                    secondary={rev.url}
                    secondaryTypographyProps={{
                      className: css.historyUrl,
                      title: rev.url,
                    }}
                  >
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Container>
  );
});
