import {createStore, combineReducers} from "redux";
import isUserSignedInReducer from './reducer/isUserSignedInReducer';


const reducers = combineReducers({
  isUserSignedIn: isUserSignedInReducer
})

const store = createStore(reducers)

export default store
