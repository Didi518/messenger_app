import { useEffect, useState } from "react";
import Image from "next/image";

import { useUserContext } from "@/context/userContext";
import { useEdgeStore } from "@/lib/edgestore";
import { gradientText } from "@/utils/tailwindStyles";
import { logout } from "@/utils/icons";

function Profile() {
  const { edgestore } = useEdgeStore();

  const { updateUser, changePassword, logoutUser } = useUserContext();

  const photo = useUserContext().user?.photo;
  const bio = useUserContext().user?.bio;
  const name = useUserContext().user?.name;

  const [localBio, setLocalBio] = useState(bio);
  const [localName, setLocalName] = useState(name);
  const [localOldPassword, setLocalOldPassword] = useState("");
  const [localNewPassword, setLocalNewPassword] = useState("");
  const [file, setFile] = useState<File>();

  const handleInput = (name: string) => (e: any) => {
    switch (name) {
      case "name":
        setLocalName(e.target.value);
        break;
      case "bio":
        setLocalBio(e.target.value);
        break;
      case "oldPassword":
        setLocalOldPassword(e.target.value);
        break;
      case "newPassword":
        setLocalNewPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleUploadImage = async () => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          temporary: false,
        },
      });

      const { url } = res;

      updateUser({ photo: url });
    }
  };

  useEffect(() => {
    handleUploadImage();
  }, [file]);

  return (
    <div className="px-4 pb-8 w-[90%]">
      <h3
        className={`pt-6 pb-8 flex justify-center text-3xl font-black ${gradientText} dark:text-white`}
      >
        Mon Profil
      </h3>
      <div className="flex flex-col">
        <div className="group relative self-center">
          <Image
            src={photo}
            alt="profil"
            width={300}
            height={300}
            className="aspect-square rounded-full object-cover border-2 border-[white] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm select-text dark:border-[#3C3C3C]/65"
          />
          <input
            type="file"
            name="file"
            id="file"
            className="absolute top-0 w-full h-full opacity-0 cursor-pointer"
            // @ts-ignore
            onChange={(e) => setFile(e.target?.files[0])}
          />
          <span className="absolute top-0 w-full h-full rounded-full cursor-pointer flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none">
            Changer d'image
          </span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser({ name: localName, bio: localBio });
          }}
        >
          <div className="mb-2">
            <label
              htmlFor="name"
              className={`text-lg font-semibold ${gradientText} dark:text-slate-200`}
            >
              Pseudonyme
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={localName}
              onChange={handleInput("name")}
              className="w-full pl-4 p-2 rounded-md bg-transparent shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className={`text-lg font-semibold ${gradientText} dark:text-slate-200`}
            >
              Biographie
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={3}
              defaultValue={localBio}
              onChange={handleInput("bio")}
              className="w-full pl-4 p-2 rounded-md bg-transparent dark:bg-[#3C3C3C]/65 resize-none dark:border-[#3C3C3C]/65 shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent"
            ></textarea>
          </div>
          <div className="py-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#7263F3] text-white p-2 rounded-md hover:bg-[#F56693] transition-colors duration-300 ease-in-out"
            >
              Changer le profil
            </button>
          </div>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changePassword(localOldPassword, localNewPassword);
            setLocalOldPassword("");
            setLocalNewPassword("");
          }}
        >
          <div className="flex gap-2">
            <div>
              <label
                htmlFor="oldPassword"
                className={`text-lg font-semibold ${gradientText} dark:text-slate-200`}
              >
                Mot de passe actuel
              </label>
              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                value={localOldPassword}
                onChange={handleInput("oldPassword")}
                className="w-full pl-4 p-2 rounded-md bg-transparent shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent
              dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className={`text-lg font-semibold ${gradientText} dark:text-slate-200`}
              >
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={localNewPassword}
                onChange={handleInput("newPassword")}
                className="w-full pl-4 p-2 rounded-md bg-transparent shadow-sm border-2 border-[white] focus:outline-none focus:ring-2 focus:ring-[#7263f3] focus:border-transparent
              dark:bg-[#3C3C3C]/65 dark:border-[#3C3C3C]/65"
              />
            </div>
          </div>
          <div className="py-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#7263f3] text-white p-2 rounded-md hover:bg-[#f56693] transition-colors duration-300 ease-in-out"
            >
              Changer le mot de passe
            </button>
          </div>
        </form>
        <div className="pt-4 self-center">
          <button
            onClick={() => logoutUser()}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 ease-in-out"
          >
            {logout} Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
