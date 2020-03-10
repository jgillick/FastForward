import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';

import theme from '../theme';
import Header from './Header';
import Footer from './Footer';
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
          <Footer />
        </Container>
      </StylesProvider>
    </ThemeProvider>
  )
};