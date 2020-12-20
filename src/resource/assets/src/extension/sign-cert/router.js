import Layout from '@/layout'

export default {
  path: '/sign-cert',
  component: Layout,
  redirect: '/sign-cert/hmac',
  alwaysShow: true,
  name: 'SignCert',
  meta: {
    title: 'SignCert',
    icon: 'el-icon-s-management',
    roles: [
      'larke-admin.sign-cert.hmac',
      'larke-admin.sign-cert.rsa',
      'larke-admin.sign-cert.ecdsa',
      'larke-admin.sign-cert.eddsa'
    ]
  },
  children: [
    {
      path: '/sign-cert/hmac',
      component: () => import('./views/hmac'),
      name: 'SignCertHmac',
      meta: {
        title: 'SignCertHmac',
        icon: 'peoples',
        roles: ['larke-admin.sign-cert.hmac']
      }
    },

    {
      path: '/sign-cert/rsa',
      component: () => import('./views/rsa'),
      name: 'SignCertRsa',
      meta: {
        title: 'SignCertRsa',
        icon: 'peoples',
        roles: ['larke-admin.sign-cert.rsa']
      }
    },

    {
      path: '/sign-cert/ecdsa',
      component: () => import('./views/ecdsa'),
      name: 'SignCertEcdsa',
      meta: {
        title: 'SignCertEcdsa',
        icon: 'peoples',
        roles: ['larke-admin.sign-cert.ecdsa']
      }
    },

    {
      path: '/sign-cert/eddsa',
      component: () => import('./views/eddsa'),
      name: 'SignCertEddsa',
      meta: {
        title: 'SignCertEddsa',
        icon: 'peoples',
        roles: ['larke-admin.sign-cert.eddsa']
      }
    },

  ]
}