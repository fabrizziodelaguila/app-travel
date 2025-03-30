import React, { createContext, useState, ReactNode } from 'react';

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
}

export const UserContext = createContext<UserContextType>({
  username: '',
  setUsername: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState('');

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};