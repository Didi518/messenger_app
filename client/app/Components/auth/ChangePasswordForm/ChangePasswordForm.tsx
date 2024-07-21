"use client";

import { useState } from "react";

import { useUserContext } from "@/context/userContext";

function ChangePasswordForm() {
  const { changePassword } = useUserContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPasssword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const currentPasswordChange = (e: any) => {
    setCurrentPassword(e.target.value);
  };

  const newPasswordChange = (e: any) => {
    setNewPasssword(e.target.value);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    changePassword(currentPassword, newPassword);

    setCurrentPassword("");
    setNewPasssword("");
  };

  return (
    <form className="ml-0 mt-0 m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Changez le mot de passe
        </h1>
        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="currentPassword" className="mb-1 text-[#999]">
            Mot de passe actuel
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="currentPassword"
            value={currentPassword}
            onChange={currentPasswordChange}
            id="currentPassword"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800 bg-transparent"
            placeholder="Votre mot de passe"
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
          <label htmlFor="newPassword" className="mb-1 text-[#999]">
            Nouveau mot de passe
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={newPasswordChange}
            id="newPassword"
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
        <div className="flex">
          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1ABC9C] transition-colors"
          >
            Valider
          </button>
        </div>
      </div>
      <img src="/flurry.png" alt="fond" />
    </form>
  );
}

export default ChangePasswordForm;
