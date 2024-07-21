import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserContext = React.createContext();

axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const serverUrl = "http://localhost:8080";

  const registerUser = async (e) => {
    e.preventDefault();
    if (
      !userState.email.includes("@") ||
      !userState.password ||
      userState.password.length < 6
    ) {
      toast.error(
        "Merci de renseigner un email et un mot de passe (minimum: 6 caractères) valide"
      );
      return;
    }

    try {
      await axios.post(`${serverUrl}/api/v1/register`, userState);
      toast.success("Nouveau compte bien enregistré");

      setUserState({
        name: "",
        email: "",
        password: "",
      });

      router.push("/connexion");
    } catch (error) {
      console.log("Erreur lors de l'enregistrement du compte", error);
      toast.error(error.response.data.message);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Le compte est bien connecté");

      setUserState({
        email: "",
        password: "",
      });

      getUser();
      router.push("/");
    } catch (error) {
      console.log("Erreur lors de la connexion du compte", error);
      toast.error(error.response.data.message);
    }
  };

  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
        withCredentials: true,
      });

      loggedIn = !!res.data;
      setLoading(false);

      if (!loggedIn) {
        router.push("/connexion");
      }
    } catch (error) {
      console.log(
        "Erreur lors de la récupération des statuts de connexion",
        error
      );
    }

    return loggedIn;
  };

  const logoutUser = async () => {
    try {
      await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true,
      });

      toast.success("Vous êtes bien déconnecté");

      router.push("/connexion");
    } catch (error) {
      console.log("Erreur lors de la déconnexion, ", error);
      toast.error(error.response.data.message);
    }
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user`, {
        withCredentials: true,
      });

      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      setLoading(false);
    } catch (error) {
      console.log(
        "Erreur lors de la récupération des détails du compte",
        error
      );
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const updateUser = async (data) => {
    setLoading(true);

    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
        withCredentials: true,
      });

      setUser((prevState) => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      toast.success("Votre compte a bien été mis à jour");

      setLoading(false);
    } catch (error) {
      console.log("Erreur lors de la mise à jour", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const emailVerification = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/v1/verify-email`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Envoi du mail de vérification effectué");
      setLoading(false);
    } catch (error) {
      console.log("Echec de l'envoi du mail de vérification", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const verifyUser = async (token) => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/v1/verify-user/${token}`,
        {},
        { withCredentials: true }
      );

      toast.success("Votre compte est maintenant validé");
      getUser();
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log("Echec de la validation du compte", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const forgotPasswordEmail = async (email) => {
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/v1/forgot-password`,
        { email },
        { withCredentials: true }
      );

      toast.success("Un mail pour le mot de passe oublié a été envoyé");
      setLoading(false);
    } catch (error) {
      console.log("Erreur lors du mail pour le mot de passe oublié", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/v1/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );

      toast.success("Votre mot de passe a bien été réinitialisé");
      setLoading(false);
      router.push("/connexion");
    } catch (error) {
      console.log("Erreur lors de la réinitialisation du mot de passe", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);

    try {
      await axios.patch(
        `${serverUrl}/api/v1/change-password`,
        { currentPassword, newPassword },
        {
          withCredentials: true,
        }
      );

      toast.success("Votre mot de passe a bien été modifié");
      setLoading(false);
    } catch (error) {
      console.log("Erreur lors de la modification du mot de passe", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${serverUrl}/api/v1/admin/users`,
        {},
        { withCredentials: true }
      );

      setAllUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Erreur lors de la récupération des utlisateurs", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handlerUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await axios.delete(
        `${serverUrl}/api/v1/admin/users/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success("Utilisateur supprimé");
      setLoading(false);
      getAllUsers();
    } catch (error) {
      console.log("Erreur lors de la suppression du compte", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const searchUsers = async (query) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${serverUrl}/api/v1/search-users?q=${query}`,
        {},
        { withCredentials: true }
      );

      setSearchResults(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Erreur lors de la recherche d'utilisateurs", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const sendFriendRequest = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/api/v1/friend-request`, id, {
        withCredentials: true,
      });

      toast.success("Deamnde d'amitié bien envoyée");
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log("Erreur lors de l'envoi de la demande d'amitié: ", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/v1/friends/accept`, id, {
        withCredentials: true,
      });

      toast.success("Requête acceptée");
      getUser();

      setLoading(false);
    } catch (error) {
      console.log("Erreur lors de l'acceptation de la requête: ", error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const loggedIn = await userLoginStatus();

      if (loggedIn) {
        await getUser();
      }
    };

    loginStatusGetUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        userLoginStatus,
        user,
        updateUser,
        emailVerification,
        verifyUser,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        allUsers,
        deleteUser,
        loading,
        searchResults,
        searchUsers,
        setSearchResults,
        sendFriendRequest,
        acceptFriendRequest,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
