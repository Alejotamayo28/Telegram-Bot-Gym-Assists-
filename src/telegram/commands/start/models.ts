export enum CommandStartCallbacks {
  login = "login",
  signUp = "signUp",
  loginExample = "loginExample",
  signUpExample = "signUpExample",
}

export const CommandStartLabels: { [key in CommandStartCallbacks]: string } = {
  [CommandStartCallbacks.login]: "Iniciar session",
  [CommandStartCallbacks.signUp]: "Craer cuenta",
  [CommandStartCallbacks.loginExample]: "Ejemplo iniciar session",
  [CommandStartCallbacks.signUpExample]: "Ejemplo crear cuenta",
};
