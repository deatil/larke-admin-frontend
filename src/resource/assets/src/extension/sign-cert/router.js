import Layout from '@/layout'

const route = {
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
      component: () => import('./views/hmac/index'),
      name: 'SignCertHmac',
      meta: {
        title: 'SignCertHmac',
        icon: 'peoples',
        roles: ['larke-admin.sign-cert.hmac']
      }
    },
    {
      path: '/sign-cert/hmac-check',
      component: () => import('./views/hmac/check'),
      name: 'SignCertHmacCheck',
      meta: {
        title: 'SignCertHmacCheck',
        roles: ['larke-admin.sign-cert.hmac-check'],
        activeMenu: '/sign-cert/hmac'
      },
      hidden: true
    },

    {
      path: '/sign-cert/rsa',
      component: () => import('./views/rsa/index'),
      name: 'SignCertHmacCheck',
      meta: {
        title: 'SignCertHmacCheck',
        icon: 'peoples',
        roles: ['larke-admin.sign-cert.rsa']
      }
    },
    {
      path: '/sign-cert/rsa-check',
      component: () => import('./views/rsa/check'),
      name: 'SignCertRsaCheck',
      meta: {
        title: 'SignCertRsaCheck',
        roles: ['larke-admin.sign-cert.rsa-check'],
        activeMenu: '/sign-cert/rsa'
      },
      hidden: true
    },

    {
      path: '/sign-cert/ecdsa',
      component: () => import('./views/ecdsa/index'),
      name: 'SignCertEcdsaCheck',
      meta: {
        title: 'SignCertEcdsaCheck',
        icon: 'peoples',
        roles: ['larke-admin.sign-cert.ecdsa']
      }
    },
    {
      path: '/sign-cert/ecdsa-check',
      component: () => import('./views/ecdsa/check'),
      name: 'SignCertEcdsa',
      meta: {
        title: 'SignCertEcdsa',
        roles: ['larke-admin.sign-cert.ecdsa-check'],
        activeMenu: '/sign-cert/ecdsa'
      },
      hidden: true
    },    

    {
      path: '/sign-cert/eddsa',
      component: () => import('./views/eddsa/index'),
      name: 'SignCertEddsa',
      meta: {
        title: 'SignCertEddsa',
        icon: 'peoples',
        roles: ['larke-admin.sign-cert.eddsa']
      }
    },
    {
      path: '/sign-cert/eddsa-check',
      component: () => import('./views/eddsa/check'),
      name: 'AuthGroupTree',
      meta: {
        title: 'AuthGroupTree',
        roles: ['larke-admin.sign-cert.eddsa-check'],
        activeMenu: '/sign-cert/eddsa'
      },
      hidden: true
    },    

  ]
}

export default route