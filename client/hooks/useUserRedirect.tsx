"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUserContext } from "@/context/userContext";

const useRedirect = (redirect: string) => {
  const { userLoginStatus } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const isLoggedUser = await userLoginStatus();

        if (!isLoggedUser) {
          router.push(redirect);
        }
      } catch (error) {
        console.log("Erreur lors de la redirection", error);
      }
    };

    redirectUser();
  }, [redirect, router, userLoginStatus]);
};

export default useRedirect;
