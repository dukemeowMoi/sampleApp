import { UPDATE_REC_APPLIST, UPDATE_APPLIST, UPDATE_SCROLL_VALUE, UPDATE_PAGE, SEARCH_APP } from '../Actions/types';
import ApplicationModel from '../Model/ApplicationModel'

const initialState = {
  recommendAppList: [],
  filteredRecommendAppList: [],
  appList: [],
  filteredAppList: [],
  page: 1,
  keyword: "",
  currentScrollValue: 0,
};

export const appReducer = (state = initialState, action) => {
  switch(action.type){
    case UPDATE_REC_APPLIST:
      return {
        ...state,
        recommendAppList:action.payload,
        filteredRecommendAppList: action.payload,
      }
    case UPDATE_APPLIST:
      return {
        ...state,
        appList: action.payload,
        filteredAppList: action.payload.slice((state.page - 1) * 10, state.page * 10)
      }
    case UPDATE_SCROLL_VALUE:
      return {
        ...state,
        currentScrollValue: action.payload
    }
    case UPDATE_PAGE:
      if (state.keyword == ""){
        return {
          ...state,
          page: action.payload,
          filteredAppList: state.appList.slice(0, state.page * 10)
        }
      }else {
        return {
          ...state,
          page: action.payload
        }
      }
    case SEARCH_APP:
      if (state.keyword == ""){
        return {
          ...state,
          keyword: action.payload,
          filteredAppList: state.appList.slice(0, state.page * 10),
          filteredRecommendAppList: state.recommendAppList
        }
      }else{
        return {
          ...state,
          keyword: action.payload,
          filteredAppList: state.appList.filter((app) => {return ApplicationModel.fromSerializable(app).searchInModel(action.payload)}),
          filteredRecommendAppList: state.recommendAppList.filter((app) => {return ApplicationModel.fromSerializable(app).searchInModel(action.payload)})
        }
      }
    default:
      return state
  }
}

export default appReducer;