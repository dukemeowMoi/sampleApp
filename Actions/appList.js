import { UPDATE_REC_APPLIST, UPDATE_APPLIST, UPDATE_SCROLL_VALUE, UPDATE_PAGE, SEARCH_APP } from './types';

export const updateRecommendAppList = recommendAppList => {
  return {
    type: UPDATE_REC_APPLIST,
    payload: recommendAppList
  }
}

export const updateAppList = appList => {
    return {
      type: UPDATE_APPLIST,
      payload: appList
    }
}

export const updateScrollValue = scrollValue => {
    return {
      type: UPDATE_SCROLL_VALUE,
      payload: scrollValue
    }
}

export const updatePage = page => {
  return {
    type: UPDATE_PAGE,
    payload: page
  }
}

export const searchApp = keyword => {
  return {
    type: SEARCH_APP,
    payload: keyword
  }
}