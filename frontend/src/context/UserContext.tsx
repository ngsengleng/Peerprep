import { ReactNode, createContext, useEffect, useState } from "react";

type Props = {
  children?: ReactNode;
};

type User = {
  username: string;
  avatar?: string;
};

type IUserContext = {
  user: User;
  setUser: (newState: User) => void;
};

const initialValue = { user: { username: "" }, setUser: () => {} };
const UserContext = createContext<IUserContext>(initialValue);

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>(initialValue.user);
  useEffect(() => {
    // TODO: remove this, for testing purposes only
    if (user.username === "") {
      const name = sessionStorage.getItem("user");
      if (name != null) {
        setUser({ ...user, username: name });
      }
      return;
    }
    sessionStorage.setItem("user", user.username);
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
