import React, { FC, SyntheticEvent, useState } from "react";
import { User } from "../model/Model";
import { AuthService } from "../services/AuthService";
import history from "../utils/history";

interface LoginProps {
  authService: AuthService;
  setUser: (user: User) => void;
}
interface LoginState {
  userName: string;
  password: string;
  loginAttenpted: boolean;
  loginSuccesfull: boolean;
}

interface CustomEvent {
  target: HTMLInputElement;
}
const Login: FC<LoginProps> = ({ authService, setUser }) => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginAttempted, setLoginAttempted] = useState<boolean>(false);
  const [loginSuccessful, setLoginSuccessful] = useState<boolean>(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoginAttempted(true);
    const result = await authService.login(userName, password);
    if (result) {
      setLoginSuccessful(true);
      setUser(result);
      history.push("/profile");
    } else {
      setLoginSuccessful(false);
    }
  };
  let loginMessage: any;
    if (loginAttempted) {
      if (loginSuccessful) {
        loginMessage = <label>Login successful</label>;
      } else {
        loginMessage = <label>Login failed</label>;
      }
    }

    return (
      <div>
        <h2>Please login</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <br />
          <input type="submit" value="Login" />
        </form>
        {loginMessage}
      </div>
    );
};
