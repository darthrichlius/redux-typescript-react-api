import Bugs from "@/components/Bugs";
import { StoreContext } from "@/context/storeContext";
import configureStore from "@store/configureStore";
import { bugApiGetBugsWithCache } from "./store/entities/bugs";

const store = configureStore();

store.dispatch(bugApiGetBugsWithCache());

// This is just for testing
// Should showcase how that the caching approach works
setTimeout(() => {
  store.dispatch(bugApiGetBugsWithCache());
}, 2000);
// This is just for testing
// Should showcase how that the caching approach works
setTimeout(() => {
  store.dispatch(bugApiGetBugsWithCache());
}, 61000);

export default function App() {
  return (
    <StoreContext.Provider value={store}>
      <Bugs />
    </StoreContext.Provider>
  );
}
