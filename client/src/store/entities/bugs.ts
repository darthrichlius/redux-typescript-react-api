import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import moment from "moment";
import type { User, Bug, BugQueryState } from "@/store/types";
import type {
  AppDispatch,
  AppRootState,
  AppState,
} from "@store/configureStore";
import { apiRequestBegan } from "@store/api";
import { ApiCaching, ApiRoutes } from "@store/config/api.config";

const API_RESOURCE_NAME = "bugs";
let lastId = 0;

/**
 * @see https://redux-toolkit.js.org/api/createslice#parameters
 */
const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [] as Bug[],
    loading: false,
    lastFetch: null,
  } as BugQueryState,
  reducers: {
    bugAdded: (bugs, action) => {
      bugs.list.push({
        id: ++lastId,
        resolved: false,
        description: action.payload.description,
        user: null,
      });
    },
    bugResolved: (bugs, action) => {
      const ix = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[ix].resolved = true;
    },
    bugAssigned: (bugs, action) => {
      const ix = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[ix].user = action.payload.userId;
    },
    // API ACTIONS
    bugApiGetBegan: (bugs) => {
      bugs.loading = true;
    },
    bugApiGetFailed: (bugs) => {
      bugs.loading = false;
    },
    bugApiGetSuccess: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
  },
});

export const { bugAdded, bugResolved, bugAssigned } = slice.actions;
export default slice.reducer;

// -------------------- ACTION CREATORS -------------------- //

interface QueryOption {
  cacheTTL: number; // in Minutes
}

/**
 * As a reminder, this chaining approach is possible thanks to redux-thunk
 * Redux Thunk allows you to return a function from an action creator instead of a plain action object.
 * This function, known as a thunk, can then be invoked with the dispatch function and getState function as arguments, giving you access to the Redux store's state and the ability to dispatch additional actions.
 */
/**
 * IMPROVEMENTS
 * This logic should not be hard coded in a Slice
 * We should make it available through the entire application
 * Plus, having two methods is not a good approach neither.
 * We should consider the following approach:
 *  1.Default caching approach
 *  2. Let's the developer out-out or configure the cache strategy
 */
export const bugApiGetBugsWithCache =
  (options?: QueryOption) =>
  (dispatch: AppDispatch, getState: () => AppRootState) => {
    const cacheTTL = options?.cacheTTL || ApiCaching.cacheTTL; // in minutes
    const { lastFetch } = getState().bugs as BugQueryState;
    const diff = moment().diff(moment(lastFetch), "minutes");

    if (lastFetch && diff < cacheTTL) return;

    dispatch(bugApiGetBugs());
  };

export const bugApiGetBugs = () =>
  apiRequestBegan({
    url: ApiRoutes[API_RESOURCE_NAME].get,
    onStart: slice.actions.bugApiGetBegan.type,
    // The commented out bellow approach is also valid
    // onSuccess: "bugs/bugApiGetSuccess"
    onSuccess: slice.actions.bugApiGetSuccess.type,
    /**
     * By default `onError`is handled by default by the API Middleware
     * This is more optimized approach and provides more flexibility in our implementation
     * We can specify `onError` for case where we want to apply a specific side-effect to the error case
     */
    onError: slice.actions.bugApiGetFailed.type,
  });

// -------------------- SELECTORS -------------------- //

export const getUnresolvedBugs = (state: AppState) =>
  state.entities.bugs.list.filter((bug) => !bug.resolved);

export const getResolvedBugs = createSelector(
  (state: AppState) => state.entities.bugs,
  (bugs) => bugs.list.filter((bug) => bug.resolved)
);

export const getUnresolvedBugs2 = createSelector(
  (state: AppState) => state.entities.bugs,
  (state: AppState) => state.entities.projects,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (bugs, projects) => bugs.list.filter((item) => !item.resolved)
);

export const getBugByUser = (userId: Pick<User, "id">) =>
  createSelector(
    (state: AppState) => state.entities.bugs,
    (state: AppState) => state.entities.users,
    (bugs) => bugs.list.filter((bug) => bug.user === userId)
  );
