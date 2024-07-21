"use client";

import { useUserContext } from "@/context/userContext";

interface Props {
  params: {
    verificationToken: string;
  };
}

function page({ params }: Props) {
  const { verificationToken } = params;
  const { verifyUser } = useUserContext();

  return (
    <div className="auth-page flex flex-col justify-center items-center">
      <div className="bg-white flex flex-col justify-center gap-[1rem] px-[4rem] py-[2rem] rounded-md">
        <h1 className=" text-[#999] text-[2rem]">Vérifiez votre email</h1>
        <button
          onClick={() => verifyUser(verificationToken)}
          className="px-4 py-2 self-center bg-blue-500 text-white rounded-md"
        >
          Vérifier
        </button>
      </div>
    </div>
  );
}

export default page;