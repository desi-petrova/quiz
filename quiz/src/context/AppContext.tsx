import { createContext } from 'react';
import { User } from "firebase/auth";
import { DailyCall } from '@daily-co/daily-js';

export interface UserState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  callObject: DailyCall | null
  setContext: React.Dispatch<React.SetStateAction<UserState>>;
}

export interface UserData {
  uid: string,
  handle: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  myTeams?: object | null,
  profilePhoto: string,
  myChannels?: { [key: string]: string } | null,
  status?: string,
}

const AppContext = createContext<UserState>({
  user: null,
  userData: null,
  loading: false,
  callObject: null,
  setContext: () => { }
});

export default AppContext;