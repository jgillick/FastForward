import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import Router from 'next/router'

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CheckIcon from '@material-ui/icons/Check';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withApollo } from '../apollo/client'
import { CREATE_LINK, LINKS_QUERY } from '../apollo/queries';

import { AuthContext } from './Authenticated';
import css from './Add.module.scss';


function Add({ linkName, linkUrl }) {
  const [url, setUrl] = useState(linkUrl || '');
  const [name, setName] = useState(linkName || '');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, openSuccess] = useState();
  const { oAuthIdToken } = useContext(AuthContext);

  const [submitLink, submitState] = useMutation(CREATE_LINK, {
    update(cache, { data: { link } }) {
      console.log(cache);
      const { links } = cache.readQuery({
        query: LINKS_QUERY,
      });
      cache.writeQuery({
        query: LINKS_QUERY,
        data: { links: links.concat([link]) },
      });
    }
  });

  /**
   * Validate name
   * @param {String} value - The name value to validate
   * @return {Boolean} True if valid
   */
  function validateNameVal(value) {
    const errs = { ...fieldErrors };
    const nameNorm = (typeof value !== 'string') ? '' : value.trim();

    errs.name = false;
    if (nameNorm.length === 0) {
      errs.name = 'Name cannot be empty';
    } else if (/[^a-z0-9\-\.]/i.test(nameNorm)) {
      errs.name = 'This can only have alphanumeric characters, "-" and "."';
    }

    setFieldErrors(errs);
    return errs.name === false;
  }

  /**
   * Validate url
   * @param {String} value - The url value to validate
   * @return {Boolean} True if valid
   */
  function validateUrlVal(value) {
    const errs = { ...fieldErrors };

    errs.url = false;
    if (value.trim().length === 0) {
      errs.url = 'URL cannot be empty.'
    } else {
      try {
        new URL(value);
      } catch (e) {
        errs.url = 'Doesn\'t look like a valid URL.'
      }
    }

    setFieldErrors(errs);
    return errs.url === false;
  }

  /**
   * Submit the values to the backend.
   */
  async function submit(evt) {
    evt.preventDefault();


    await submitLink({
      variables: {
        name,
        url,
        oAuthIdToken,
      },
    });

    setUrl('');
    setName('');
    openSuccess(true);
    Router.push('/_/links');
  }

  /**
   * Close success snackbar
   */
  function handleSuccessClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    openSuccess(false);
  }

  /**
   * Update and validate the name value
   */
  function updateName(evt) {
    const { value } = evt.target;
    setName(value);
    validateNameVal(value);
  }

  /**
   * Update and validate the URL value
   */
  function updateUrl(evt) {
    const { value } = evt.target;
    setUrl(value);
    validateUrlVal(value);
  }

  return (
    <Container component="main" maxWidth="xs">
      <form onSubmit={submit} noValidate>
        <Typography variant="h2" className={css.title}>
          Add a new link
        </Typography>
        { Boolean(!submitState.loading && submitState.error) && (
          <Alert severity="error" variant="filled" className={css.error}>
            Whoops. The server stumbled while trying to create that link.
          </Alert>
        )}
        <TextField
          required
          fullWidth
          variant="outlined"
          margin="normal"
          id="linkName"
          label="GoLink Name"
          name="name"
          value={name}
          error={!!fieldErrors.name}
          helperText={fieldErrors.name}
          onChange={updateName}
          onBlur={updateName}
        />
        <TextField
          required
          fullWidth
          variant="outlined"
          margin="normal"
          name="url"
          id="linkUrl"
          label="Full URL"
          value={url}
          error={!!fieldErrors.url}
          helperText={fieldErrors.url}
          onChange={updateUrl}
          onBlur={updateUrl}
        />
        <div className={css.buttonContainer}>
          <Button
            fullWidth
            type="submit"
            size="medium"
            variant="contained"
            color="secondary"
            disabled={submitState.loading}
            className={success ? css.buttonSuccess : ''}
          >
            {success ? <CheckIcon /> : 'Add'}
          </Button>
          {submitState.loading && (
            <div className={css.buttonLoader}>
              <CircularProgress size={36} className={css.loadingSpinner} />
            </div>
          )}
        </div>

        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={success}
          autoHideDuration={4000}
          onClose={handleSuccessClose}
        >
          <Alert onClose={handleSuccessClose} severity="success" variant="filled">
            Link added!
          </Alert>
        </Snackbar>
      </form>
    </Container>
  );
}

export default withApollo(Add);
