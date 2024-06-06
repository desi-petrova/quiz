import { SearchUsersBoxProps } from "../../common/typeScriptDefinitions";


const SearchUsersBox = ({
        userName,
        email,
        firstName,
        lastName,
        // imageSrc,
        setOpen,
        setSearchValue,
        updateNewUsers} : SearchUsersBoxProps) => {
            console.log(updateNewUsers)

    const handleClick = () => {
        console.log(6)
        if (updateNewUsers) {
            console.log(1)
            updateNewUsers(userName);}
        console.log(2)
        setOpen(false);
        setSearchValue('');
      };

   
      
    return(
        <div className="searchBox" >
            <button>
              <div className="flex" onClick={handleClick}>
              <div className="avatar placeholder">
              <div className="bg-purple-500 text-neutral-content rounded-full w-10 h-10 m-2">
              <span>{firstName[0]}{lastName[0]}</span>
              </div>
            </div> 
            <div>
                <p>{firstName} {lastName}</p>
                <p> ({userName}) {email}</p>
            </div></div></button>
            
            
        </div>
    )
} 

export default SearchUsersBox;