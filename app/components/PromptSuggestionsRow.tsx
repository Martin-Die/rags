import React from 'react';
import PromptSuggestionButton from "./PromptSuggestionButton";

interface PromptSuggestionsRowProps {
    onPromptClick: (prompt: string) => void;
}

const PromptSuggestionsRow: React.FC<PromptSuggestionsRowProps> = ({ onPromptClick }) => {

    const prompts = [
        "c'est quoi le seo ?",
        "comment appliquer le seo ?",
    ];

    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) =>
                <PromptSuggestionButton
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />)
            }
        </div>
    )
};

export default PromptSuggestionsRow;