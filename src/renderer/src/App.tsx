import { useEffect, useRef, useState } from 'react';
import { IoMdChatbubbles } from "react-icons/io";
import { FaUser } from "react-icons/fa";

export interface ChatUserstateExtended {
  istwitch: boolean
  isyoutube: boolean
  thumbnail: string
  isMod: boolean
  isSub: boolean
  isOwner: boolean
}

export type MessageEventData = {
  message: string
  username: string
  extra?: ChatUserstateExtended
}

function App(): JSX.Element {
  const [messages, setMessages] = useState<MessageEventData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - scrollTop === clientHeight) {
        setIsScrolledUp(false);
      } else {
        setIsScrolledUp(true);
      }
    }
  };

  useEffect(() => {
    const handleMessage = (_event: any, data: MessageEventData) => {
      setMessages(prevMessages => [...prevMessages, data]);
    }

    window.electron.ipcRenderer.on('chat-message', handleMessage);

    return () => {
      window.electron.ipcRenderer.removeListener('chat-message', handleMessage);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col w-full h-screen rounded-md ">
      {
        messages.length === 0 && (
          <div className='flex flex-col gap-2 items-center justify-center w-full h-screen bg-zinc-800'>
            <IoMdChatbubbles className='w-32 h-32' />
            <h3 className='text-center text-md font-bold'>Está tudo tão calmo</h3>
            <p className='text-center text-xs'>Em breve seu chat aparecerá aqui...</p>
          </div>
        )
      }
      <div
        className="flex-1 flex flex-col overflow-auto p-2 pb-4 justify-end"
        ref={containerRef}
      >

        {
          messages.map((item, index) => (
            <div data-isowner={item.extra?.isOwner} key={index} className="chat chat-start data-[isowner=true]:chat-end">
              <div className="relative chat-image avatar">
                <div className="w-10 rounded-full">
                  {
                    item.extra.thumbnail !== "user.png" && (
                      <img
                        alt={item.username}
                        src={item.extra.thumbnail}
                      />
                    )
                  }
                  {
                    item.extra.thumbnail === "user.png" && (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500">
                        <FaUser className='w-4 h-4 text-white' />
                      </div>
                    )
                  }
                  {
                    item.extra?.isyoutube && (
                      <div className='absolute bottom-0 right-0 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white'>
                        YT
                      </div>
                    )
                  }
                  {
                    item.extra?.istwitch && (
                      <div className='absolute bottom-0 right-0 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white'>
                        T
                      </div>
                    )
                  }
                </div>
              </div>
              <div data-isowner={item.extra?.isOwner} className="chat-bubble data-[isowner=true]:chat-bubble-primary  max-w-full text-sm no-drag">
                {item.message}
              </div>
              <div className="chat-footer flex flex-row items-center gap-2">
                {item.username}
                {
                  !item.extra?.isOwner && (
                    <>
                      {
                        item.extra?.isMod && (
                          <div className='w-fit h-4 p-1 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white'>
                            MOD
                          </div>
                        )
                      }
                      {
                        item.extra?.isSub && (
                          <div className='w-fit h-4 p-1 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold text-white'>
                            Sub/Member
                          </div>
                        )
                      }
                    </>
                  )
                }
              </div>
            </div>
          ))
        }
        <div ref={messagesEndRef} />
      </div>
      {isScrolledUp && (
        <div className='px-6 py-1 flex items-center justify-center'>
          <button
            className="btn btn-secondary w-full btn-sm"
            onClick={scrollToBottom}
          >
            Voltar para o final
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
