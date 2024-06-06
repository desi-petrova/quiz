import { useContext, useEffect, useState } from "react";
import { getAllUsersData } from "../../services/users.service";
import { SearchUsersProps, User } from "../../common/typeScriptDefinitions.ts";
import AppContext from "../../context/AppContext";
import SearchUsersBox from "../SearchUsersBox/SearchUsersBox.tsx";


const SearchUsers = ({updateNewUsers}: SearchUsersProps ) => {

    const [initialData, setInitialData] = useState<User[]>([])
    const { userData } = useContext(AppContext);
    const [searchValue, setSearchValue] = useState<string>('')
    const [filteredResults, setFilteredResults] = useState<User[]>([]);
    const [open, setOpen] = useState(false);



    useEffect(() => {
        getAllUsersData()
        .then(data => {
            const snapshot: User[] = Object.values(data.val());
            setInitialData(snapshot);
          })
          .catch((err: Error) => console.error(err));
    },[])

    //console.log(initialData)

    const searchUser = (value: string) => {
        setSearchValue(value);
    if (!value) return ;
    const trimmedSearchValue = value.trim().toLocaleLowerCase();
    const filteredUsers = initialData.filter(user => {
    const username = user.handle.toLowerCase();
    if (username === userData?.handle.toLowerCase()) return;
    const email = user.email.toLowerCase();
    const firstName = user.firstName.toLowerCase();
    const lastName = user.lastName.toLowerCase();
    const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;

      if (firstName.startsWith(trimmedSearchValue)) return user;
      if (lastName.startsWith(trimmedSearchValue)) return user;
      if (username.startsWith(trimmedSearchValue)) return user;
      if (email.startsWith(trimmedSearchValue)) return user;
      if (fullName.startsWith(trimmedSearchValue)) return user;
    });

    const sortedFilteredUsers = filteredUsers.sort((a, b) => {
    const aFirstNameContainsString = a.firstName.toLowerCase().includes(trimmedSearchValue);
    const aLastNameContainsString = a.lastName.toLowerCase().includes(trimmedSearchValue);
    const bFirstNameContainsString = b.firstName.toLowerCase().includes(trimmedSearchValue);
    const bLastNameContainsString = b.lastName.toLowerCase().includes(trimmedSearchValue);

      if (aFirstNameContainsString && !bFirstNameContainsString) {
        return -1;
      } else if (!aFirstNameContainsString && bFirstNameContainsString) {
        return 1;
      } else if (aLastNameContainsString && !bLastNameContainsString) {
        return -1;
      } else if (!aLastNameContainsString && bLastNameContainsString) {
        return 1;
      } else {
        return 0;
      }
    });
    setFilteredResults(sortedFilteredUsers);
    }
    
//console.log(updateNewUsers)
    return (
    <div 
    onFocus={() => setOpen(true)}
    onBlur={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setOpen(false);
      }
    }}>
       <input type="text" 
       className="input input-bordered input-sm w-full max-w-xs" 
       placeholder="Search by username / names / email"
       value={searchValue}
       onChange={(e) => searchUser(e.target.value)}/>
       {open && <div className="search">
          {searchValue.length > 0 &&
            filteredResults?.map((user) => <SearchUsersBox
              key={user.handle}
              userName={user.handle}
              email={user.email}
              firstName={user.firstName}
              lastName={user.lastName}
              // imageSrc={user.profilePhoto}
              setOpen={setOpen}
              setSearchValue={setSearchValue}
              updateNewUsers={updateNewUsers}
            />)}
        </div>
      }
    </div>
    )
}

export default SearchUsers;