import Cookies from 'js-cookie'

const TokenKey = 'Larke-Admin-Token'
const TokenExpiredInKey = 'Larke-Admin-Expired-In'
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
    return localStorage.setItem(TokenKey, token);
  } else if (type == 'session') {
    return sessionStorage.setItem(TokenKey, token);
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken() {
  if (type == 'local') {
    return localStorage.removeItem(TokenKey)
  } else if (type == 'session') {
    return sessionStorage.removeItem(TokenKey)
  } else {
    return Cookies.remove(TokenKey)
  }
}

export function getTokenExpiredIn(type = 'local') {
  if (type == 'local') {
    return localStorage.getItem(TokenExpiredInKey) || ''
  } else if (type == 'session') {
    return sessionStorage.getItem(TokenExpiredInKey) || ''
  } else {
    return Cookies.get(TokenExpiredInKey)
  }
}

export function setTokenExpiredIn(time, type = 'local') {
  if (type == 'local') {
    return localStorage.setItem(TokenExpiredInKey, time);
  } else if (type == 'session') {
    return sessionStorage.setItem(TokenExpiredInKey, time);
  } else {
    return Cookies.set(TokenExpiredInKey, time)
  }
}

export function removeTokenExpiredIn(type = 'local') {
  if (type == 'local') {
    return localStorage.removeItem(TokenExpiredInKey)
  } else if (type == 'session') {
    return sessionStorage.removeItem(TokenExpiredInKey)
  } else {
    return Cookies.remove(TokenExpiredInKey)
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
    return localStorage.setItem(RefreshTokenKey, token);
  } else if (type == 'session') {
    return sessionStorage.setItem(RefreshTokenKey, token);
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
