'use client'

import Image from "next/image";
import LogoLBDD from "./assets/Logo LBDD.png";
import { useChat } from "ai/react";
import { Message } from "ai";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

const Home = () => {

    const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat();
    const noMessages = !messages || messages.length === 0;
    const handlePrompt = (promptText: string) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user",
        };
        append(msg);
    };

    return (
        <main>
            <Image
                src={LogoLBDD}
                width="250"
                alt="Logo LBDD"
                priority={false}
            />
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                        <p className="Start-text">
                            Le RAG le plus puissant fait en France par Le Blog Du Dirigeant
                        </p>
                        <br />
                        <PromptSuggestionsRow onPromptClick={handlePrompt} />
                    </>
                ) : (
                    <>
                        {/* map messages onto text bubbles */}
                        {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}
                        {isLoading && <LoadingBubble />}
                    </>
                )}
            </section>

            <form onSubmit={handleSubmit}>
                <input
                    className="question-box"
                    onChange={handleInputChange}
                    value={input}
                    placeholder="Posez moi une question"
                />
                <input type="submit" />
            </form>

        </main>
    )
};

export default Home