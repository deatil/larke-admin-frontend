const routeFiles = require.context('@/extension/', true, /router.js$/)

let routers = []

routeFiles.keys().map(item => {
  // require route.js
  // eslint-disable-next-line no-const-assign
  routers.push(routeFiles(item).default)
})

export default routers
