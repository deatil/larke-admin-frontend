const routeFiles = require.context('@/extension/', true, /router.js$/)

let routers = []

routeFiles.keys().map(item => {
  routers.push(routeFiles(item).default)
})

export default routers
