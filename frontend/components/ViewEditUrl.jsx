import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag'

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LinearProgress from '@material-ui/core/LinearProgress';

import { AuthContext } from './Authenticated';
import { withApollo } from '../apollo/client';

import css from './ViewEditUrl.module.scss';

const UPDATE_LINK = gql`
  mutation updateLink(
    $name: String!,
    $url: String!,
    $oAuthIdToken: String!,
  ) {
    updateLink (
      url: $url
      name: $name
      oAuthIdToken: $oAuthIdToken
    ) {
      url
    }
  }
`;

function ViewEditUrl(props) {
  const { link, className, onChange } = props;
  const origUrl = link.url;
  const editEnabled = process.env.LINK_EDITING === 'enabled';

  const [url, setUrl] = useState(link.url || '');
  const [isEditing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const { oAuthIdToken } = useContext(AuthContext);
  const [submitUrl, submitState] = useMutation(UPDATE_LINK);

  /**
   * Update the URL value
   * @param {Event} evt
   */
  function updateUrl(evt) {
    const { value } = evt.target;

    let error = false;
    if (value.trim().length === 0) {
      error = 'URL cannot be empty.'
    } else {
      try {
        new URL(value);
      } catch (e) {
        error = 'Doesn\'t look like a valid URL.'
      }
    }

    setError(error);
    setUrl(value);
  }

  /**
   * Update URL
   */
  async function saveUrl(evt) {
    evt.preventDefault();

    // The URL didn't change, cancel edit
    if (url.trim() === origUrl.trim()) {
      cancelEdit();
    }

    try {
      await submitUrl({
        variables: {
          url,
          oAuthIdToken,
          name: link.name,
        }
      });
      setUrl(url);
      setEditing(false);
      if (typeof onChange === 'function') {
        onChange();
      }
    } catch(e) {
      setError('Could not save URL.');
      console.error(e.networkError.result.errors);
    }
  }

  /**
   * Cancel URL edit
   */
  function cancelEdit(){
    setUrl(origUrl);
    setEditing(false);
  }

  return (
    <div className={className}>
      {(isEditing)
        ? (
          <>
            <form className={css.editContainer} onSubmit={saveUrl}>
              <TextField
                required
                fullWidth
                autoFocus
                name="url"
                label="Full URL"
                value={url}
                error={!!error}
                helperText={error}
                onChange={updateUrl}
                onBlur={updateUrl}
                disabled={submitState.loading}
                className={css.field}
              />
              <Tooltip title="Save" className={css.editButton}>
                <IconButton
                  color="primary"
                  type="submit"
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel" className={css.editButton}>
                <IconButton color="secondary" onClick={cancelEdit}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </form>
            { submitState.loading && (
              <LinearProgress />
            )}
          </>
        ) : (
          <Typography variant="body1" className={css.viewContainer}>
            { editEnabled && (
              <Tooltip title="Edit URL">
                <IconButton size="small" onClick={() => editEnabled && setEditing(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <a href={link.url} className={css.viewUrl}>
              {link.url}
            </a>
          </Typography>
        )}
    </div>
  );
}

export default withApollo(ViewEditUrl);
