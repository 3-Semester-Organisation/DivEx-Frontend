import useCheckCredentials from '@/js/useCredentials';
import React, { useState } from 'react';
import SettingsForm from '@/components/ui/custom/settings-form';
import DeleteAccountDialog from '@/components/divex/DeleteAccountDialog';

export default function Settings() {

  useCheckCredentials();
  
  return (
    <>
      <div>
        <SettingsForm />
        <DeleteAccountDialog />    
      </div>
    </>
  )
}