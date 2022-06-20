import {
  ArrowCircleLeftIcon,
  EmojiHappyIcon,
  ExclamationCircleIcon,
  HeartIcon,
  PaperAirplaneIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  messageUserSelectedState,
  PhotoModalState,
  realUserState,
  selectedUserState,
  sendMessageState,
} from "../atoms/modalAtom";
import { db } from "../firebase";
import ChatMessage from "./ChatMessage";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import PhotoModal from "./PhotoModal";

function ChatBox() {
  const [open, setOpen] = useRecoilState(sendMessageState);
  const [openPhoto, setOpenPhoto] = useRecoilState(PhotoModalState);
  const { data: session } = useSession();
  const [userSelected, setUserSelected] = useRecoilState(
    messageUserSelectedState
  );
  const [selectedUser, setSelectedUser] = useRecoilState(selectedUserState);
  const userSelectedReverse = session.user.uid + selectedUser;
  const [inboxData, setInboxData] = useState({});
  const [messageInput, setMessageInput] = useState("");
  const [realUser, setRealUser] = useRecoilState(realUserState);
  const [selectedUserData, setSelectedUserData] = useState([]);
  const [chatMessage, loading] = useCollection(
    realUser &&
      query(
        collection(db, "inbox", realUser, "messages"),
        orderBy("timestamp", "asc")
      )
  );
  const sendMessage = (e) => {
    e.preventDefault();
    const getInboxUserData = getDoc(doc(db, "users", selectedUser));
    getInboxUserData.then((data) => {
      addDoc(collection(db, "inbox", realUser, "messages"), {
        message: messageInput,
        timestamp: serverTimestamp(),
        senderId: session.user.uid,
        senderImg: session.user.image,
        receiverId: selectedUser,
        receiverImg: data.data().userImage,
      });
    });
    chatRef.current.scrollIntoView({
      behavior: "smooth",
    });
    setMessageInput("");
  };
  // console.log(messageInput)

  const chatRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      if (userSelected) {
        await getDoc(doc(db, "users", selectedUser)).then((data) => {
          setSelectedUserData(data.data());
        });
        await getDoc(doc(db, "inbox", userSelected)).then((data) => {
          if (data.exists()) {
            setInboxData(data.data());
            setRealUser(userSelected);
          } else {
            const secondTry = async () => {
              await getDoc(doc(db, "inbox", userSelectedReverse)).then(
                (secondData) => {
                  if (secondData.exists()) {
                    setInboxData(secondData.data());
                    setRealUser(userSelectedReverse);
                  } else {
                    const thirdTry = async () => {
                      await getDoc(doc(db, "users", selectedUser)).then(
                        (data) => {
                          setDoc(doc(db, "inbox", userSelected), {
                            userId: userSelected,
                            senderId: session.user.uid,
                            senderName: session.user.name,
                            senderProfile: session.user?.image,
                            receiverId: data.data().userId,
                            receiverName: data.data().name,
                            receiverProfile: data.data().userImage,
                          }).then((snapshot) => {
                            getDoc(doc(db, "inbox", userSelected)).then(
                              (snapshot) => {
                                setRealUser(userSelected);
                                setInboxData(snapshot.data());
                                console.log(snapshot.data());
                              }
                            );
                          });
                        }
                      );
                    };
                    thirdTry();
                  }
                }
              );
            };
            secondTry();
          }
        });
      }
    };
    fetchData();
  }, [userSelected]);
  // console.log(realUser)
  // console.log(userSelectedReverse)
  useEffect(() => {
    chatRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [userSelected, loading]);
  return userSelected && chatMessage ? (
    <div className="bg-white md:my-7 border rounded-sm h-[83vh] flex flex-col ">
      <div className="flex justify-between my-4 ml-5 mr-9 ">
        <div className="flex items-center space-x-3 cursor-pointer">
          <ArrowCircleLeftIcon
            onClick={() => setUserSelected(null)}
            className="justify-center h-8 cursor-pointer md:hidden"
          />
          <img
            className="rounded-full h-7"
            src={
              inboxData.senderId === selectedUserData.userId
                ? inboxData?.senderProfile
                : inboxData?.receiverProfile
            }
            alt=""
          />
          <h1 className="font-semibold ">
            {inboxData.senderId === selectedUserData.userId
              ? inboxData?.senderName
              : inboxData?.receiverName}
          </h1>
        </div>
        <ExclamationCircleIcon className="justify-center h-8 cursor-pointer" />
      </div>
      <hr className="text-gray-500" />
      <div className="flex-1 max-w-full px-3 pt-4 pr-5 overflow-x-hidden overflow-y-scroll">
        {chatMessage.docs.map((message) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            msg={message.data()?.message}
            senderId={
              realUser === userSelectedReverse
                ? message.data().receiverId
                : message.data().senderId
            }
            receiverId={
              realUser === userSelectedReverse
                ? message.data().senderId
                : message.data().receiverId
            }
            senderImg={
              realUser === userSelectedReverse
                ? message.data().receiverImg
                : message.data().senderImg
            }
            receiverImg={
              realUser === userSelectedReverse
                ? message.data().senderImg
                : message.data().receiverImg
            }
            img={message.data()?.image}
          />
        ))}
        <div ref={chatRef} id="bottom" className="pb-1"></div>
      </div>
      <div className="">
        <div className="flex items-center justify-between px-4 py-2 mx-4 my-5 space-x-3 border rounded-3xl">
          <EmojiHappyIcon className="cursor-pointer h-9" />
          <form className="w-full">
            <input
              maxLength={1000}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="w-full border-none focus:ring-0 "
              type="text"
              placeholder="Message..."
            />
            <button hidden type="submit" onClick={sendMessage}></button>
          </form>
          <PhotographIcon
            onClick={() => setOpenPhoto(true)}
            className="cursor-pointer h-9"
          />
          <PhotoModal />
          <HeartIcon className="cursor-pointer h-9" />
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-white md:my-7 hidden md:flex border rounded-sm h-[83vh] flex-col items-center justify-center space-y-3">
      <div className="rotate-45">
        <PaperAirplaneIcon className="p-4 border-2 border-black rounded-full  h-19 md:h-24" />
      </div>
      <h1 className="text-2xl font-light">Your Messages</h1>
      <p className="text-sm font-light text-gray-500">
        Send private photos and messages to a friend or group.
      </p>
      <button
        onClick={() => setOpen(true)}
        className="px-2 py-1 text-white transition-colors duration-100 ease-out bg-blue-500 rounded-md hover:bg-blue-700"
      >
        Send Message
      </button>
    </div>
  );
}

export default ChatBox;
