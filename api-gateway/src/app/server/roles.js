const AccessControl = require('accesscontrol')
const ac = new AccessControl()

exports.roles = (function () {
  ac.grant('basic').readOwn('profile').updateOwn('profile')

  ac.grant('premium').extend('basic')

  ac.grant('admin')
    .extend('basic')
    .extend('premium')
    .updateAny('profile')
    .deleteAny('profile')

  return ac
})()
