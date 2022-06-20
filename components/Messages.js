import ChatBox from "./ChatBox";
import Message from "./Message";
import SendMessage from "./SendMessage";

function messages() {
  return (
    <main className="grid grid-cols-2 mx-auto mb-3 overflow-y-hidden md:grid-cols-3 md:max-w-5xl xl:grid-cols-3 xl:max-w-5xl">
      <section className="col-span-2 md:col-span-1">
        <Message />
      </section>
      <section className="col-span-2 md:col-span-2 xl:col-span-2">
        <ChatBox />
        <SendMessage />
      </section>
    </main>
  );
}

export default messages;
