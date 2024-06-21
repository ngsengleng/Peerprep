export type SignupResp = {
  signupSuccess: boolean;
  username?: string;
  errorCode?: ErrorCode;
};

export type ErrorResp = {
  errorCode: number;
  errorMessage: string;
};

export type LoginResp = {
  loginSuccess: boolean;
  username?: string;
  errorCode?: ErrorCode;
};

export enum ErrorCode {
  UNKNOWN,
  BAD_JSON,
  USER_EXISTS,
  USER_DOES_NOT_EXIST,
  INCORRECT_PASSWORD,
}
