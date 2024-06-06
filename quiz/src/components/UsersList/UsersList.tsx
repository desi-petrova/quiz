import { useEffect, useState } from "react";
import { getUserByHandle } from "../../services/users.service";
import { User, UsersListProps } from "../../common/typeScriptDefinitions";
import { HiMiniXMark } from "react-icons/hi2";


const UsersList = ({handle}: UsersListProps) => {

    
    const [userInfo, setUserInfo] = useState<User>({})

    useEffect(() => {
        getUserByHandle(handle)
        .then(result => {
            setUserInfo(result.val());
            // if(result.val().profilePhoto){
            //     setImageSrc(result.val().profilePhoto);
            // }
        })
        .catch(e =>console.error(e));
    }, [handle]);

    const removeUser = () => {

    }
    return(
        <div className="flex justify-between items-center border-b border-gray-300" > 
            <p className="p-2">{userInfo.firstName} {userInfo.lastName}</p>
            <button className="card-button" 
            onClick={removeUser}>
            <HiMiniXMark size={20}/></button>
            
        </div>
    )
}

export default UsersList;