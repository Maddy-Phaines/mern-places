import Input from "../../shared/components/FormElements/input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import BirthdaySelect from "../components/BirthdayComposite";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "../../places/pages/NewPlace.css";
import { useForm } from "../../shared/hooks/form-hook";

import { useState, useEffect, useMemo } from "react";
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
    image: {
      value: null,
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
  const [shake, setShake] = useState(false);
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, handleFormChange, setFormData] = useForm(
    loginConfig.inputs,
    loginConfig.isValid
  );

  useEffect(() => {
    if (!shake) return;
    const timer = setTimeout(() => setShake(false), 300);
    return () => clearTimeout(timer);
  }, [shake]);

  const handleInput = (...args) => {
    // if (error) setError(null);
    console.log(handleFormChange(...args));
    console.log(...args);
  };
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
          nextInputs.surname?.isValid &&
          nextInputs.image?.isValid
        );

    console.log("Inputs:", nextInputs);
    setFormData(nextInputs, isValid);
    setIsLoginMode(nextIsLoginMode);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    console.log(formState.inputs);

    console.log(
      "SUBMIT CLICKED, isLoginMode:",
      isLoginMode,
      "formState:",
      formState
    );
    if (!formState.isValid) return;
    if (!isLoginMode && !dobComplete) return;

    const { email, password } = formState.inputs;

    const fullName = !isLoginMode
      ? `${formState.inputs.firstName.value} ${formState.inputs.surname.value}`
      : undefined;

    try {
      const url = isLoginMode
        ? "http://localhost:5000/api/users/login"
        : "http://localhost:5000/api/users/signup";
      const headers = isLoginMode ? { "Content-Type": "application/json" } : {};
      const formData = new FormData();
      let body;
      if (isLoginMode) {
        body = JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        });
      } else {
        formData.append("email", formState.inputs.email.value);
        formData.append("name", fullName);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        body = formData;
      }

      let bodyPreview;
      if (isLoginMode) {
        try {
          bodyPreview = JSON.parse(body);
        } catch (e) {
          bodyPreview = body;
        }
      } else {
        bodyPreview = Array.from(body.entries());
      }
      console.log("Auth sending", { url, headers, bodyPreview });

      const responseData = await sendRequest(url, "POST", body, headers);

      // Pass the user id if your context expects it
      auth.login(responseData.user.id);
      // In Auth.jsx after auth.login(...)
      console.log("Logged in userId:", responseData.user.id);
    } catch (err) {
      console.error("Auth error:", err);

      setShake(true); // trigger shake
    }

    console.log({
      email,
      passwordLength: password.length,
      ...(!isLoginMode &&
        dobComplete && {
          dateOfBirth: `${dob.day}-${dob.month}-${dob.year}`,
        }),
    });
  };

  return (
    <Card className={`authentication ${shake ? "authentication--shake" : ""}`}>
      {error && <p className="auth-error">{error}</p>}
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
              onInput={handleInput}
            />

            <Input
              id="surname"
              element="input"
              type="text"
              label=""
              name="surname"
              autoComplete="family-name"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Surname"
              validators={nameValidators}
              errorText="What's your surname?"
              onInput={handleInput}
            />
          </div>
        )}
        {!isLoginMode && (
          <ImageUpload center id="image" onInput={handleInput} />
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
          isLoading={isLoading}
          loadingLabel={isLoginMode ? "LOGGING IN..." : "SIGNING UP..."}
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
