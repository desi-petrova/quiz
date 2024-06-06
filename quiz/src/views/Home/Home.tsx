import { useContext } from 'react';
import MyQuestionnaire from '../../components/MyQuestionnaire/MyQuestionnaire';
import AppContext, { UserState } from '../../context/AppContext';
import UpcomingQuizzes from '../../components/UpcomingQuizzes/UpcomingQuizzes';

const Home = () => {
    const { userData } = useContext<UserState>(AppContext);

    return (
        <div className="w-4/5 mx-auto">
        Hello
        {userData && <MyQuestionnaire />}
        {userData && <UpcomingQuizzes />}
        </div>
    );
} 

export default Home;