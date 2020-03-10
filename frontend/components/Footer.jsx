import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import css from './Footer.module.scss';

export default function Footer() {
  return (
    <Container component="main" maxWidth="xs" className={css.footer}>
      <Typography variant="body2">
        FastForward Links
      </Typography>
      <Typography variant="body2">
        <a href="https://github.com/jgillick/FastForward">
          Github
        </a>
      </Typography>
    </Container>
  )
};