import { useNavigate } from 'react-router-dom';


interface Link {
    name: string;
    path: string;
  }
  
  interface TopNavLinksProps {
    links: Link[];
  }
  
  const TopNavButtons = ({ links }: TopNavLinksProps) => {
    const navigate = useNavigate();
   

    return (
    <div>
       {links.map((link) => (
       <button key={link.name} className='btn mr-3 bg-purple-800 text-center text-sm font-semibold text-white hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
       onClick= {() => navigate(link.path)}>{link.name}</button>
       ))}
    </div>
    )
  }
  
  export default TopNavButtons;