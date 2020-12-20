import Cookies from 'js-cookie'

const TokenKey = 'Larke-Admin-Token'
const TokenExpiresInKey = 'Larke-Admin-Expires-In'
const RefreshTokenKey = 'Larke-Admin-Refresh-Token'

export function getToken(type = 'local') {
  if (type == 'local') {
    return localStorage.getItem(TokenKey) || ''
  } else if (type == 'session') {
    return sessionStorage.getItem(TokenKey) || ''
  } else {
    return Cookies.get(TokenKey)
  }
}

export function setToken(token, type = 'local') {
  if (type == 'local') {
    return localStorage.setItem(TokenKey, token)
  } else if (type == 'session') {
    return sessionStorage.setItem(TokenKey, token)
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken(type = 'local') {
  if (type == 'local') {
    return localStorage.removeItem(TokenKey)
  } else if (type == 'session') {
    return sessionStorage.removeItem(TokenKey)
  } else {
    return Cookies.remove(TokenKey)
  }
}

export function getTokenExpiresIn(type = 'local') {
  if (type == 'local') {
    return localStorage.getItem(TokenExpiresInKey) || ''
  } else if (type == 'session') {
    return sessionStorage.getItem(TokenExpiresInKey) || ''
  } else {
    return Cookies.get(TokenExpiresInKey)
  }
}

export function setTokenExpiresIn(time, type = 'local') {
  if (type == 'local') {
    return localStorage.setItem(TokenExpiresInKey, time)
  } else if (type == 'session') {
    return sessionStorage.setItem(TokenExpiresInKey, time)
  } else {
    return Cookies.set(TokenExpiresInKey, time)
  }
}

export function removeTokenExpiresIn(type = 'local') {
  if (type == 'local') {
    return localStorage.removeItem(TokenExpiresInKey)
  } else if (type == 'session') {
    return sessionStorage.removeItem(TokenExpiresInKey)
  } else {
    return Cookies.remove(TokenExpiresInKey)
  }
}

export function getRefreshToken(type = 'local') {
  if (type == 'local') {
    return localStorage.getItem(RefreshTokenKey) || ''
  } else if (type == 'session') {
    return sessionStorage.getItem(RefreshTokenKey) || ''
  } else {
    return Cookies.get(RefreshTokenKey)
  }
}

export function setRefreshToken(token, type = 'local') {
  if (type == 'local') {
    return localStorage.setItem(RefreshTokenKey, token)
  } else if (type == 'session') {
    return sessionStorage.setItem(RefreshTokenKey, token)
  } else {
    return Cookies.set(RefreshTokenKey, token)
  }
}

export function removeRefreshToken(type = 'local') {
  if (type == 'local') {
    return localStorage.removeItem(RefreshTokenKey)
  } else if (type == 'session') {
    return sessionStorage.removeItem(RefreshTokenKey)
  } else {
    return Cookies.remove(RefreshTokenKey)
  }
}
