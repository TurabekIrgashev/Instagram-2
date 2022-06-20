import Image from "next/image";
import {
  HeartIcon,
  MenuIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  SearchIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
  messageOpenState,
  messageUserSelectedState,
  modalState,
} from "../atoms/modalAtom";
import { useEffect, useState } from "react";
import { doc, setDoc } from "@firebase/firestore";
import { db } from "../firebase";
function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useRecoilState(modalState);
  const [verified, setVerified] = useState(false);
  const [messageOpen, setMessageOpen] = useRecoilState(messageOpenState);
  const [userSelected, setUserSelected] = useRecoilState(
    messageUserSelectedState
  );
  const handleOnClick = (e) => {
    if (verified === false) {
      setVerified(true);
    }
    setMessageOpen(true);
  };

  const homeIconClick = (e) => {
    () => router.push("/");
    setMessageOpen(false);
    setUserSelected(null);
  };

  useEffect(() => {
    if (session) {
      setDoc(doc(db, "users", session?.user?.uid), {
        userId: session.user.uid,
        name: session?.user?.name,
        username: session?.user?.username,
        userImage: session?.user?.image,
      });
    }
  }, [verified]);

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex justify-between max-w-6xl mx-5 xl:mx-auto">
        <div
          onClick={() => router.push("/")}
          className="relative hidden w-24 cursor-pointer lg:inline-grid"
        >
          <Image
            src="https://links.papareact.com/ocw"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div
          onClick={() => router.push("/")}
          className="relative flex-shrink-0 w-10 cursor-pointer lg:hidden"
        >
          <Image
            src="https://links.papareact.com/jjm"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="max-w-xs">
          <div className="relative p-3 mt-1 rounded-md">
            <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none ">
              <SearchIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input
              className="block w-full pl-10 border-gray-300 rounded-md bg-gray-50 sm:text-sm focus:ring-black focus:border-black"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <HomeIcon onClick={homeIconClick} className="navBtn" />
          <HomeIcon
            onClick={homeIconClick}
            className="h-6 cursor-pointer md:hidden"
          />
          <PaperAirplaneIcon
            onClick={handleOnClick}
            className="h-6 rotate-45 cursor-pointer md:hidden"
          />
          <PlusCircleIcon
            onClick={() => setOpen(true)}
            className="h-6 cursor-pointer md:hidden"
          />
          {session ? (
            <>
              <div className="relative navBtn">
                <PaperAirplaneIcon
                  onClick={handleOnClick}
                  className="rotate-45 navBtn"
                />
                <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-2 animate-pulse">
                  3
                </div>
              </div>
              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="navBtn"
              />
              <UserGroupIcon className="navBtn" />
              <HeartIcon className="navBtn" />
              <img
                onClick={signOut}
                src={session.user?.image}
                alt="profile pic"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </>
          ) : (
            <button onClick={signIn}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
