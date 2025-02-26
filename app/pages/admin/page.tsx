'use client'

import React, { useState } from 'react';
import { createAssistant } from '@/app/db/queries/insert';

// Définition de l'interface AssistantData
interface AssistantData {
    role: string;
    image: string | null;
    domaine: string;
    nom: string;
    description: string;
    phrase: string;
    theme: string;
    id?: number;
    createdAt?: string;
    modifiedDate?: Date | null;
}

function DataInsertForm() {
    const [assistantData, setAssistantData] = useState<AssistantData>({
        role: '',
        image: null,
        domaine: '',
        nom: '',
        description: '',
        phrase: '',
        theme: '',
    });

    const handleAssistantSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createAssistant(assistantData);
            alert('Assistant created successfully');
            setAssistantData({
                role: '',
                image: null,
                domaine: '',
                nom: '',
                description: '',
                phrase: '',
                theme: '',
            });
        } catch (error) {
            console.error('Error creating assistant:', error);
        }
    };

    return (
        <div>
            <h2>Create Assistant</h2>
            <form onSubmit={handleAssistantSubmit}>
                <input
                    type="text"
                    value={assistantData.nom}
                    onChange={(e) => setAssistantData({ ...assistantData, nom: e.target.value })}
                    placeholder="Nom"
                    required
                />
                <input
                    type="text"
                    value={assistantData.role}
                    onChange={(e) => setAssistantData({ ...assistantData, role: e.target.value })}
                    placeholder="Role"
                    required
                />
                <input
                    type="text"
                    value={assistantData.domaine}
                    onChange={(e) => setAssistantData({ ...assistantData, domaine: e.target.value })}
                    placeholder="Domaine"
                    required
                />
                <input
                    type="text"
                    value={assistantData.description}
                    onChange={(e) => setAssistantData({ ...assistantData, description: e.target.value })}
                    placeholder="Description"
                    required
                />
                <input
                    type="text"
                    value={assistantData.phrase}
                    onChange={(e) => setAssistantData({ ...assistantData, phrase: e.target.value })}
                    placeholder="Phrase"
                    required
                />
                <input
                    type="text"
                    value={assistantData.theme}
                    onChange={(e) => setAssistantData({ ...assistantData, theme: e.target.value })}
                    placeholder="Theme"
                    required
                />
                <input
                    type="text"
                    value={assistantData.image || ''}
                    onChange={(e) => setAssistantData({ ...assistantData, image: e.target.value })}
                    placeholder="Image URL"
                />
                <button type="submit">Create Assistant</button>
            </form>
        </div>
    );
}

export default DataInsertForm;
