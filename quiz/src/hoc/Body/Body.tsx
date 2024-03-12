import { ReactNode } from 'react';

interface BodyProps {
  children: ReactNode
}

const Body = ({ children }: BodyProps): JSX.Element => {

  return (
    <div>
    {children}
    </div>  
  )
}

export default Body;