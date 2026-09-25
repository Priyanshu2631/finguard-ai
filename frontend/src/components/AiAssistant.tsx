import { useState } from "react";

import {
    askAiAssistant,
} from "../services/transactionService";

import type {
    Transaction,
} from "../services/transactionService";


interface Props {
    transactions: Transaction[];
}


interface Message {
    role: "user" | "ai";
    content: string;
}


function formatAiResponse(text: string) {

    const lines = text.split("\n");

    return lines.map((line, index) => {

        const trimmedLine = line.trim();

        if (!trimmedLine) {
            return (
                <div
                    key={index}
                    className="ai-response-space"
                />
            );
        }

        const bulletMatch =
            trimmedLine.match(/^[-•*]\s+(.*)$/);

        if (bulletMatch) {
            return (
                <div
                    key={index}
                    className="ai-response-list-item"
                >
                    <span className="ai-response-bullet">
                        •
                    </span>

                    <span>
                        {formatBoldText(
                            bulletMatch[1]
                        )}
                    </span>
                </div>
            );
        }

        const numberedMatch =
            trimmedLine.match(/^(\d+)[.)]\s+(.*)$/);

        if (numberedMatch) {
            return (
                <div
                    key={index}
                    className="ai-response-list-item"
                >
                    <span className="ai-response-number">
                        {numberedMatch[1]}.
                    </span>

                    <span>
                        {formatBoldText(
                            numberedMatch[2]
                        )}
                    </span>
                </div>
            );
        }

        const headingMatch =
            trimmedLine.match(
                /^\*\*(.*?)\*\*:?\s*$/
            );

        if (headingMatch) {
            return (
                <h3
                    key={index}
                    className="ai-response-heading"
                >
                    {headingMatch[1]}
                </h3>
            );
        }

        return (
            <p
                key={index}
                className="ai-response-paragraph"
            >
                {formatBoldText(trimmedLine)}
            </p>
        );
    });
}


function formatBoldText(text: string) {

    const parts =
        text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {

        if (
            part.startsWith("**") &&
            part.endsWith("**")
        ) {
            return (
                <strong key={index}>
                    {part.slice(2, -2)}
                </strong>
            );
        }

        return part;
    });
}


function AiAssistant({
    transactions,
}: Props) {

    const [question, setQuestion] =
        useState("");

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [loading, setLoading] =
        useState(false);


    const handleAsk = async () => {

        if (
            !question.trim() ||
            loading
        ) {
            return;
        }

        const currentQuestion =
            question.trim();

        setQuestion("");

        setMessages((previous) => [
            ...previous,
            {
                role: "user",
                content: currentQuestion,
            },
        ]);

        try {

            setLoading(true);

            const result =
                await askAiAssistant(
                    currentQuestion,
                    transactions
                );

            setMessages((previous) => [
                ...previous,
                {
                    role: "ai",
                    content: result.answer,
                },
            ]);

        } catch (error) {

            console.error(
                "AI Assistant Error:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to connect to FinGuard AI right now.";

            setMessages((previous) => [
                ...previous,
                {
                    role: "ai",
                    content: message,
                },
            ]);

        } finally {

            setLoading(false);
        }
    };


    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            handleAsk();
        }
    };


    const handleSuggestion = (
        suggestion: string
    ) => {

        if (loading) {
            return;
        }

        setQuestion(suggestion);
    };


    const clearConversation = () => {

        if (loading) {
            return;
        }

        setMessages([]);
        setQuestion("");
    };


    const hasMessages =
        messages.length > 0;


    return (
        <section className="ai-assistant">

            <div className="ai-assistant-header">

                <div className="ai-assistant-title">

                    <div className="ai-assistant-icon">
                        🤖
                    </div>

                    <div>

                        <h2>
                            Ask FinGuard AI
                        </h2>

                        <p>
                            Get AI-powered answers
                            about your finances.
                        </p>

                    </div>

                </div>


                {hasMessages && (

                    <button
                        className="ai-clear-button"
                        onClick={
                            clearConversation
                        }
                        disabled={loading}
                    >
                        Clear Chat
                    </button>

                )}

            </div>


            <div className="ai-assistant-context">

                <span>
                    📊
                </span>

                <span>
                    Analyzing{" "}
                    <strong>
                        {transactions.length}
                    </strong>{" "}
                    transaction
                    {transactions.length !== 1
                        ? "s"
                        : ""}
                </span>

            </div>


            {!hasMessages && (

                <div className="ai-assistant-empty">

                    <div className="ai-empty-icon">
                        ✨
                    </div>

                    <h3>
                        How can I help?
                    </h3>

                    <p>
                        Ask me anything about your
                        spending, income, transactions,
                        or financial patterns.
                    </p>

                </div>

            )}


            <div className="ai-question-box">

                <input
                    type="text"
                    placeholder={
                        "Ask something about your finances..."
                    }
                    value={question}
                    onChange={(e) =>
                        setQuestion(
                            e.target.value
                        )
                    }
                    onKeyDown={
                        handleKeyDown
                    }
                    disabled={loading}
                />

                <button
                    onClick={handleAsk}
                    disabled={
                        loading ||
                        !question.trim()
                    }
                >
                    {loading
                        ? "Thinking..."
                        : "Ask AI"}
                </button>

            </div>


            <div className="ai-suggestions">

                <button
                    onClick={() =>
                        handleSuggestion(
                            "Where am I spending the most?"
                        )
                    }
                    disabled={loading}
                >
                    <span>📊</span>
                    Where am I spending the most?
                </button>


                <button
                    onClick={() =>
                        handleSuggestion(
                            "Give me a summary of my finances."
                        )
                    }
                    disabled={loading}
                >
                    <span>💰</span>
                    Summarize my finances
                </button>


                <button
                    onClick={() =>
                        handleSuggestion(
                            "How can I reduce my expenses?"
                        )
                    }
                    disabled={loading}
                >
                    <span>💡</span>
                    How can I reduce expenses?
                </button>


                <button
                    onClick={() =>
                        handleSuggestion(
                            "What are the most unusual patterns in my transactions?"
                        )
                    }
                    disabled={loading}
                >
                    <span>🔍</span>
                    Find unusual patterns
                </button>

            </div>


            {hasMessages && (

                <div className="ai-chat">

                    {messages.map(
                        (message, index) => (

                            <div
                                key={index}
                                className={
                                    message.role === "user"
                                        ? "ai-message ai-message-user"
                                        : "ai-message ai-message-ai"
                                }
                            >

                                <div className="ai-message-label">

                                    {message.role === "user"
                                        ? "You"
                                        : "🤖 FinGuard AI"}

                                </div>


                                <div className="ai-message-content">

                                    {message.role === "ai"
                                        ? formatAiResponse(
                                            message.content
                                        )
                                        : message.content}

                                </div>

                            </div>
                        )
                    )}


                    {loading && (

                        <div className="ai-message ai-message-ai">

                            <div className="ai-message-label">
                                🤖 FinGuard AI
                            </div>

                            <div className="ai-thinking">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        </div>

                    )}

                </div>
            )}

        </section>
    );
}


export default AiAssistant;