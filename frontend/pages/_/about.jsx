import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Tooltip from '@material-ui/core/Tooltip';
import GitHubIcon from '@material-ui/icons/GitHub';

import * as pkg from '../../../package.json';

import css from './about.module.scss';

export default function About() {
  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h2" align="center" gutterBottom={true} className={css.header}>
        FastForward Links v{pkg.version}
      </Typography>
      <Typography variant="body1" align="center" paragraph={true}>
        A simple short link service.
      </Typography>
      <Typography variant="body1" align="center" paragraph={true}>
        <a href="https://github.com/jgillick/FastForward">
          <Tooltip title="Github">
            <GitHubIcon color="secondary" />
          </Tooltip>
        </a>
      </Typography>
    </Container>
  )
}
