import useCheckCredentials from "@/js/useCredentials";
import React from "react";
import SettingsForm from "@/components/ui/custom/settings-form";

export default function Settings({ isLoggedIn }) {
  useCheckCredentials();

  return (
    <>
      <div className="flex">
        <h1 className="text-5xl mb-10">Settings</h1>
      </div>
      <SettingsForm />
    </>
  );
}
