import React, {
    useRef,
    useState,
    MouseEvent,
    SetStateAction,
    Dispatch,
  } from "react";
  import {
    CalendarIcon,
    EmojiHappyIcon,
    LocationMarkerIcon,
    PhotographIcon,
    SearchCircleIcon,
  } from "@heroicons/react/outline";
  import { useSession } from "next-auth/react";
  import { Tweet, TweetBody } from "../typings";
  import { fetchTweets } from "../utils/fetchTweets";
  import toast from "react-hot-toast";
  
  interface Props {
    setTweets: Dispatch<SetStateAction<Tweet[]>>;
  }
  
  function TweetBox({ setTweets }: Props) {
    const [input, setInput] = useState<string>("");
    const [image, setImage] = useState<string>("");
  
    const imageInputRef = useRef<HTMLInputElement>(null);
  
    const { data: session } = useSession();
    const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);
  
    const addImageToTweet = (
      e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
      e.preventDefault();
      if (!imageInputRef.current?.value) return;
  
      setImage(imageInputRef.current.value);
      imageInputRef.current.value = "";
      setImageUrlBoxIsOpen(false);
    };
  
    const postTweet = async () => {
      const tweetInfo: TweetBody = {
        text: input,
        username: session?.user?.name || "Unknown User",
        profileImg:
          session?.user?.image ||
          "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
        image: image,
      };
      const result = await fetch(`/api/addTweet`, {
        body: JSON.stringify(tweetInfo),
        method: "POST",
      });
  
      const json = await result.json();
  
      const newTweets = await fetchTweets();
      setTweets(newTweets);
  
      toast("Tweet Posted", {
        icon: ">>",
      });
      return json;
    };
  
    const handleSubmit = (
      e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
      e.preventDefault();
      postTweet();
      setInput("");
      setImage("");
      setImageUrlBoxIsOpen(false);
    };
  
    return (
      <div className="flex p-5 space-x-2">
        <img
          className="object-cover mt-4 rounded-full h-14 w-14"
          src={
            session?.user?.image ||
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
          }
          alt=""
        />
        <div className="flex items-center flex-1 pl-2">
          <form className="flex flex-col flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-24 text-xl outline-none placeholder:text-xl"
              type="text"
              placeholder="What's Happening?"
            />
            <div className="flex items-center">
              <div className="flex flex-1 space-x-2 text-twitter">
                <PhotographIcon
                  onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                  className="w-5 h-5 transition-transform ease-out cursor-pointer from-neutral-150 hover:scale-150"
                />
                <SearchCircleIcon className="w-5 h-5" />
                <EmojiHappyIcon className="w-5 h-5" />
                <CalendarIcon className="w-5 h-5" />
                <LocationMarkerIcon className="w-5 h-5" />
              </div>
  
              <button
                onClick={handleSubmit}
                disabled={!input || !session}
                className="px-5 py-2 font-bold text-white rounded-full bg-twitter disabled:opacity-40"
              >
                Tweet
              </button>
            </div>
            {imageUrlBoxIsOpen && (
              <div className="flex px-4 py-2 mt-5 rounded-lg bg-twitter/80">
                <input
                  ref={imageInputRef}
                  className="flex-1 p-2 text-white bg-transparent outline-none placeholder:text-white"
                  type="text"
                  placeholder="Enter Image URl..."
                />
                <button
                  type="submit"
                  onClick={addImageToTweet}
                  className="font-bold text-white"
                >
                  Add Image
                </button>
              </div>
            )}
            {image && (
              <img
                className="object-contain w-full h-40 mt-10 shadow-lg rounded-xl"
                src={image}
                alt=""
              />
            )}
          </form>
        </div>
      </div>
    );
  }
  
  export default TweetBox;