import Container from '@material-ui/core/Container';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';

import theme from '../theme';
import Header from './Header';
import css from './Layout.module.scss';

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <Container component="main" maxWidth="sm" className={css.page}>
          <Header />
          <Container component="main" maxWidth="sm" className={css.main}>
            { children }
          </Container>
        </Container>
      </StylesProvider>
    </ThemeProvider>
  )
};
