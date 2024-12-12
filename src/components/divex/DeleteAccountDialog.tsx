import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteUser } from '@/api/user';
import React from "react";

export default function DeleteAccountDialog() {

    const navigate = useNavigate();
      function handleDelete() {
    
        const isDeleted = deleteUser();
    
        if (isDeleted) {
          navigate("/login")
          toast("Your account was succesfully deleted.")
        }
      }

    return(
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='hover:bg-primary-foreground'>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className='bg-red-500 hover:bg-red-500 hover:opacity-90'
                onClick={() => handleDelete()}
              >
                Delte
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    )
}