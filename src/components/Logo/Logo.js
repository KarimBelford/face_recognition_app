import React from "react";
import './Logo.css'
import Tilt from 'react-parallax-tilt';
import eye from './eye.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="br2 shadow-2" style={{ height: '150px',width: '150px'}}>
                <div className="pa3">
                    <img style ={{paddingTop: '20px'}} alt ='logo'src = {eye}/>
                </div>
            </Tilt>
        </div>       
    );
}

export default Logo