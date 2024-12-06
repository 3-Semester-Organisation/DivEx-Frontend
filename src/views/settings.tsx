import useCheckCredentials from '@/js/useCredentials';
import * as React from 'react';


export default function settings( {isLoggedIn} ) {
    
  useCheckCredentials();

    return (
    <>
    <div>
        <h1>Settings</h1>
                <p>settings page</p>
                
                
    </div>
    </>
)
}