import useCheckCredentials from '@/js/useCredentials';
import React, { useState } from 'react';
import SettingsForm from '@/components/ui/custom/settings-form';
import DeleteAccountDialog from '@/components/divex/DeleteAccountDialog';

export default function Settings() {

  useCheckCredentials();
  
  return (
    <>
      <div className="flex">
        <h1 className="text-5xl mb-10">Settings</h1>
      </div>
        <div>
        <SettingsForm />
        <DeleteAccountDialog />    
      </div>
    </>
  )
}
