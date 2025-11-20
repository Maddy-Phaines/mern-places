import "./Input.css";
import { useReducer, useEffect } from "react";
import { validate } from "../../util/validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    case "RESET":
      return {
        value: action.value ?? "",
        isValid:
          typeof action.isValid === "boolean"
            ? action.isValid
            : validate(action.value ?? "", action.validators || []),
        isTouched: false,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const {
    id,
    type,
    label,
    validators,
    errorText,
    initialValue,
    initialValid,
    onInput,
    rows,
    placeholder,
    element = "input",
    ...domProps // safe extras like name, autoComplete, inputMode, etc.
  } = props;

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue || "",
    isTouched: false,
    isValid: initialValid || false,
  });

  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  useEffect(() => {
    // only reset when parent-provided initialValue/initialValid change meaningfully
    const nextValue = initialValue ?? "";
    const nextIsValid =
      typeof initialValid === "boolean"
        ? initialValid
        : validate(nextValue, validators || []);

    if (inputState.value !== nextValue || inputState.isValid !== nextIsValid) {
      dispatch({
        type: "RESET",
        value: nextValue,
        isValid: typeof initialValid === "boolean" ? initialValid : undefined,
        validators: validators || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, initialValid]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: validators || [],
    });
  };
  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const errorId = `${id}-error`;
  const showError = inputState.isTouched && !inputState.isValid;

  const elementNode =
    element === "input" ? (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        {...domProps}
      />
    ) : (
      <textarea
        id={id}
        rows={rows || 3}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
        {...domProps}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={id}>{label}</label>
      {elementNode}
      {!inputState.isValid && inputState.isTouched && <p>{errorText}</p>}
    </div>
  );
};

export default Input;
