const INITIAL_STATE = false

const isUserSignedInReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_USER_AUTH':
      return state = !state
    case 'IS_USER_SIGNED_IN':
      return state
    default:
      return state
  }
}

export default isUserSignedInReducer

