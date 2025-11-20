import Input from "../../shared/components/FormElements/input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import BirthdaySelect from "../components/BirthdayComposite";
import "./Auth.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "../../places/pages/NewPlace.css";
import { useForm } from "../../shared/hooks/form-hook";

import { useState, useMemo } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";

const loginConfig = {
  inputs: {
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  },
  isValid: false,
};

const signupConfig = {
  inputs: {
    firstName: {
      value: "",
      isValid: false,
    },
    surname: {
      value: "",
      isValid: false,
    },
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  },
  isValid: false,
};

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [dob, setDob] = useState({ day: "", month: "", year: "" });

  const [formState, handleFormChange, setFormData] = useForm(
    loginConfig.inputs,
    loginConfig.isValid
  );
  const dobComplete = !!(dob.day && dob.month && dob.year);

  const emailValidators = useMemo(
    () => [VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()],
    []
  );
  const pwValidators = useMemo(() => [VALIDATOR_MINLENGTH(8)], []);
  const nameValidators = useMemo(() => [VALIDATOR_REQUIRE()], []);
  const handleSwitchMode = () => {
    const nextIsLoginMode = !isLoginMode;
    const base = nextIsLoginMode ? loginConfig : signupConfig;

    let nextInputs = { ...base.inputs };

    if (formState.inputs?.email?.value && formState.inputs.email.isValid) {
      nextInputs.email = {
        value: formState.inputs.email.value.trim().toLowerCase(),
        isValid: true,
      };
    }

    const isValid = nextIsLoginMode
      ? !!(nextInputs.email?.isValid && nextInputs.password?.isValid)
      : !!(
          nextInputs.email?.isValid &&
          nextInputs.password?.isValid &&
          nextInputs.firstName?.isValid &&
          nextInputs.surname?.isValid
        );

    setFormData(nextInputs, isValid);
    setIsLoginMode(nextIsLoginMode);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!formState.isValid) return;
    if (!isLoginMode && !dobComplete) return;
    //call login here?

    const { email, password } = formState.inputs;
    const emailValue = email.value.trim().toLowerCase();
    const passwordValue = password.value;

    auth.login();

    console.log({
      email: emailValue,
      passwordLength: passwordValue.length,
      ...(!isLoginMode &&
        dobComplete && {
          dateOfBirth: `${dob.day}-${dob.month}-${dob.year}`,
        }),
    });
  };

  return (
    <Card className="authentication">
      {isLoginMode ? <h2>Login Required</h2> : <h2>Create a new account</h2>}

      <hr />
      <form className="" onSubmit={handleAuthSubmit} noValidate>
        {!isLoginMode && (
          <div className="flex gap-2">
            <Input
              id="firstName"
              element="input"
              type="text"
              label=""
              name="firstName"
              autoComplete="given-name"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="First name"
              validators={nameValidators}
              errorText="What's your name?"
              onInput={handleFormChange}
            />
            <Input
              id="surname"
              element="input"
              type="text"
              label=""
              name="surName"
              autoComplete="family-name"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Surname"
              validators={nameValidators}
              errorText="What's your surname?"
              onInput={handleFormChange}
            />
          </div>
        )}
        <Input
          id="email"
          element="input"
          type="email"
          initialValue={formState.inputs.email?.value}
          initialValid={formState.inputs.email?.isValid}
          label="Email"
          name="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          validators={emailValidators}
          errorText="Please enter a valid email."
          onInput={handleFormChange}
          placeholder={
            isLoginMode
              ? "Enter your email address"
              : "Choose email address for your account"
          }
        />
        <Input
          id="password"
          element="input"
          type="password"
          initialValue={formState.inputs.password?.value}
          initialValid={formState.inputs.password?.isValid}
          label="Password"
          name="password"
          autoComplete={isLoginMode ? "current-password" : "new-password"}
          validators={pwValidators}
          errorText="Password must have at least 8 characters."
          onInput={handleFormChange}
          placeholder={
            isLoginMode ? "Enter your password" : "Create a new password"
          }
        />
        {!isLoginMode && <BirthdaySelect value={dob} onChange={setDob} />}
        <div className="my-4"></div>
        <Button
          type="submit"
          inverse
          disabled={!formState.isValid || (!isLoginMode && !dobComplete)}
        >
          {isLoginMode ? "LOGIN" : "SIGN UP"}
        </Button>
      </form>
      <Button type="button" onClick={handleSwitchMode}>
        SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
      </Button>
    </Card>
  );
};

export default Auth;
