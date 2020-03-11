
enum errors {
  LINK_NOT_FOUND = 'LINK_NOT_FOUND',
  LINK_EXISTS = 'LINK_EXISTS',
  LINK_EDITING_DISABLED = 'LINK_EDITING_DISABLED',

  // Not a valid oAuth ID
  INVALID_AUTH = 'INVALID_AUTH',

  // Login domain does not match whitelist
  AUTH_INVALID_DOMAIN = 'AUTH_INVALID_DOMAIN',

  // No user for this oAuth ID
  AUTH_NO_USER = 'AUTH_NO_USER',
}
export default errors;
