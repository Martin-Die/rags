import React from 'react';
import PromptSuggestionButton from "./PromptSuggestionButton";
import { ragSEOPrompts } from '@/assistants/seo/questions';

interface PromptSuggestionsRowProps {
    onPromptClick: (prompt: string) => void;
}

const PromptSuggestionsRow: React.FC<PromptSuggestionsRowProps> = ({ onPromptClick }) => {

    return (
        <div className="prompt-suggestion-row">
            {ragSEOPrompts.map((prompt, index) =>
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