import { ReactNode, createContext, useState } from "react";

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
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
