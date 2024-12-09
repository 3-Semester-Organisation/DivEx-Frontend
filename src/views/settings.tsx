import useCheckCredentials from '@/js/useCredentials';
import React from 'react';
import SettingsForm from '@/components/ui/custom/settings-form';


export default function Settings( {isLoggedIn} ) {
    
  useCheckCredentials();

  

    
  return (
    <>
    <SettingsForm />
    </>


  )
}