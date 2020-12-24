import request from '@/utils/request'

export function hmac(data) {
  return request({
    url: '/sign-cert/hmac',
    method: 'post',
    data
  })
}

export function hmacCheck(data) {
  return request({
    url: '/sign-cert/hmac-check',
    method: 'post',
    data
  })
}


export function rsa(data) {
  return request({
    url: '/sign-cert/rsa',
    method: 'post',
    data
  })
}

export function rsaCheck(data) {
  return request({
    url: '/sign-cert/rsa-check',
    method: 'post',
    data
  })
}


export function ecdsa(data) {
  return request({
    url: '/sign-cert/ecdsa',
    method: 'post',
    data
  })
}

export function ecdsaCheck(data) {
  return request({
    url: '/sign-cert/ecdsa-check',
    method: 'post',
    data
  })
}


export function eddsa(data) {
  return request({
    url: '/sign-cert/eddsa',
    method: 'post',
    data
  })
}

export function eddsaCheck(data) {
  return request({
    url: '/sign-cert/eddsa-check',
    method: 'post',
    data
  })
}

