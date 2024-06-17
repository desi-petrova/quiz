import { useContext } from 'react';
import MyQuestionnaire from '../../components/MyQuestionnaire/MyQuestionnaire';
import AppContext, { UserState } from '../../context/AppContext';
import UpcomingQuizzes from '../../components/UpcomingQuizzes/UpcomingQuizzes';
import MyCompletedQuizzes from '../../components/MyCompletedQuizzes/MyCompletedQuizzes';

const Home = () => {
    const { userData } = useContext<UserState>(AppContext);

    return (
        <div className="relative h-screen">
        <div className="absolute inset-0 bg-[url('/public/7233949.jpg')] bg-cover bg-center ">
        <div className="absolute inset-0 bg-white opacity-55"></div>
        <div className="relative z-10 w-4/5 mx-auto ">
        {userData && <MyQuestionnaire />}
        {userData && <UpcomingQuizzes />}
        {userData && <MyCompletedQuizzes />}
        </div>
        </div>       
        </div> 
    );
} 

export default Home;