import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function homepage() {
    return (
    <>
    <div>
        <h1>Homepage</h1>
                <p>Welcome to the homepage</p>
                { /* remove token from local storage */ }
                <Button onClick={() => localStorage.removeItem('token')}>remove token (logout)</Button>
    </div>
    </>
)
}