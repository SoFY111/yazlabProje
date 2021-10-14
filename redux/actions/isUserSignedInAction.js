const isUserSigned = () => ({
  type: 'IS_USER_SIGNED_IN'
})

const userAuthChange = () => ({
  type: 'CHANGE_USER_AUTH'
})
export {isUserSigned, userAuthChange}
