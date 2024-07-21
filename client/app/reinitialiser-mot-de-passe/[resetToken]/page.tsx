"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { useUserContext } from "@/context/userContext";

interface Props {
  params: {
    resetToken: string;
  };
}

function page({ params: { resetToken } }: Props) {
  const { resetPassword } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne sont pas identiques");
      return;
    }

    resetPassword(resetToken, password);
  };

  return (
    <main className="auth-page w-full h-full flex justify-center items-center">
      <form className="m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full">
        <div className="relative z-10">
          <h1 className="mb-2 text-center text-[1.35rem] font-medium">
            Réinitialisez le mot de passe
          </h1>
          <div className="relative mt-[1rem] flex flex-col">
            <label htmlFor="password" className="mb-1 text-[#999]">
              Nouveau mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handlePasswordChange}
              id="password"
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800 bg-transparent"
              placeholder="Votre nouveau mot de passe"
            />
            <button
              type="button"
              className="absolute p-1 right-4 top-[43%] text-[22px] opacity-45"
            >
              {showPassword ? (
                <i className="fas fa-eye-slash" onClick={togglePassword}></i>
              ) : (
                <i className="fas fa-eye" onClick={togglePassword}></i>
              )}
            </button>
          </div>
          <div className="relative mt-[1rem] flex flex-col">
            <label htmlFor="password" className="mb-1 text-[#999]">
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              id="confirmPassword"
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800 bg-transparent"
              placeholder="Confirmez votre nouveau mot de passe"
            />
            <button
              type="button"
              className="absolute p-1 right-4 top-[43%] text-[22px] opacity-45"
            >
              {showPassword ? (
                <i className="fas fa-eye-slash" onClick={togglePassword}></i>
              ) : (
                <i className="fas fa-eye" onClick={togglePassword}></i>
              )}
            </button>
          </div>
          <div className="flex">
            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1ABC9C] transition-colors"
            >
              Réinitialisation
            </button>
          </div>
        </div>
        <img src="/flurry.png" alt="fond" />
      </form>
    </main>
  );
}

export default page;
