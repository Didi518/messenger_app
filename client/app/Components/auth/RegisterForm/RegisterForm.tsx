"use client";

import React from "react";

import { useUserContext } from "@/context/userContext";

function RegisterForm() {
  const { registerUser, userState, handlerUserInput } = useUserContext();
  const { name, email, password } = userState;
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <form className="auth-form relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Enregistrez votre compte
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Créez votre compte. Déjà inscrit ?{" "}
          <a
            href="/connexion"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3]"
          >
            Connectez-vous ici
          </a>
        </p>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-[#999]">
            Nom Complet
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => handlerUserInput("name")(e)}
            id="name"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800 bg-transparent"
            placeholder="Votre nom"
          />
        </div>
        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => handlerUserInput("email")(e)}
            id="email"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800 bg-transparent"
            placeholder="Votre email"
          />
        </div>
        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="password" className="mb-1 text-[#999]">
            Mot de passe
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => handlerUserInput("password")(e)}
            id="password"
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
        <div className="flex">
          <button
            type="submit"
            disabled={!name || !email || !password}
            onClick={registerUser}
            className="mt-[1.5rem] flex-1 px-4 py-3 bg-[#2ECC71] text-white rounded-md hover:bg-[#1ABC9C] transition-colors"
          >
            Inscription
          </button>
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;
