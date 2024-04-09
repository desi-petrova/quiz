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
       <button onClick= {() => navigate(link.path)}>{link.name}</button>
       ))}
    </div>
    )
  }
  
  export default TopNavButtons;