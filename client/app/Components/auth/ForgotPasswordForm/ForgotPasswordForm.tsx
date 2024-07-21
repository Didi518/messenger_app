"use client";

import { useState } from "react";

import { useUserContext } from "@/context/userContext";

function ForgotPasswordForm() {
  const { forgotPasswordEmail } = useUserContext();
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    forgotPasswordEmail(email);

    setEmail("");
  };

  return (
    <form className="forgot-password-form m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Entrez l'email associé à votre compte
        </h1>
        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800 bg-transparent"
            placeholder="Votre email"
          />
        </div>
        <div className="flex">
          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1ABC9C] transition-colors"
          >
            Modifier mot de passe
          </button>
        </div>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
