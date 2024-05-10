import { ReactNode } from 'react';

import NavBar from '../../components/NavBar/NavBar'

interface BodyProps {
  children: ReactNode
}

const Body = ({ children }: BodyProps): JSX.Element => {
 

  return (
    <div>
      <NavBar />
      <div>{children}</div>
    </div>  
  )
}

export default Body;