import { useReducer } from "react";

interface State {
  count: number;
  error: string | null;
}

interface Action {
  type: "increment" | "decrement";
}

const reducer = (state: State, action: Action) => {
  const { type } = action;

  switch (type) {
    case "increment": {
      const newCount = state.count + 1;
      const hasError = newCount > 5;
      return {
        ...state,
        count: hasError ? state.count : newCount,
        error: hasError ? "Maximum value reached" : null,
      };
    }
    case "decrement":
      const newCount = state.count - 1;
      const hasError = newCount < 0;
      return {
        ...state,
        count: hasError ? state.count : newCount,
        error: hasError ? "Minum limit has been reached" : null,
      };
    case "decrement":
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      return state;
  }
};

const Count = () => {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    error: null,
  });
  return (
    <div className="flex items-center justify-center gap-2 bg-dark">
      <div className="bg-teal-900 p-6">
        <div className="text-white">Count: {state.count}</div>
        {state.error && <div className="mb-2 text-red-500">{state.error}</div>}
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: "increment" })}
            className="cursor-pointer px-4 py-1 text-white bg-violet-800 rounded-lg"
          >
            Increment
          </button>
          <button
            onClick={() => dispatch({ type: "decrement" })}
            className="cursor-pointer px-4 py-1 text-white bg-violet-800 rounded-lg"
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  );
};
export default Count;
