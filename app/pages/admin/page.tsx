'use client'

import { useState, useEffect } from 'react';
import { fetchAssistants, addAssistant, updateAssistant, deleteAssistant, Assistant } from './crudOperations';

export default function Admin() {
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState<boolean>(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
    const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null);

    useEffect(() => {
        fetchAssistants().then(setAssistants).catch(console.error);
    }, []);

    const handleAdd = async (formData: FormData) => {
        try {
            await addAssistant(formData);
            setIsAddPopupOpen(false);
            const updatedAssistants = await fetchAssistants();
            setAssistants(updatedAssistants);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Une erreur inconnue s'est produite.");
            }
        }
    };

    const handleUpdate = async (formData: FormData) => {
        try {
            await updateAssistant(formData, currentAssistant);
            setIsEditPopupOpen(false);
            const updatedAssistants = await fetchAssistants();
            setAssistants(updatedAssistants);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Une erreur inconnue s'est produite.");
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet assistant ?")) {
            try {
                await deleteAssistant(id);
                const updatedAssistants = await fetchAssistants();
                setAssistants(updatedAssistants);
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert("Une erreur inconnue s'est produite.");
                }
            }
        }
    };

    return (
        <main>
            <div>
                <button onClick={() => setIsAddPopupOpen(true)}>Ajouter un assistant</button>

                {assistants.map(assistant => (
                    <div key={assistant.id}>
                        <h3>{assistant.nom}</h3>
                        <p>{assistant.description}</p>
                        <button onClick={() => {
                            setCurrentAssistant(assistant);
                            setIsEditPopupOpen(true);
                        }}>Modifier</button>
                        <button onClick={() => handleDelete(assistant.id)}>Supprimer</button>
                    </div>
                ))}

                {isAddPopupOpen && (
                    <div className="popup">
                        <form action={handleAdd}>
                            <input name="domaine" placeholder="Domaine" required />
                            <input name="role" placeholder="Rôle" required />
                            <input name="nom" placeholder="Nom" required />
                            <textarea name="description" placeholder="Description" required />
                            <input name="phrase" placeholder="Phrase" required />
                            <input name="image" type="file" accept="image/*" required />
                            <input name="theme" placeholder="Thème (ex: #RRGGBB)" required />
                            <button type="submit">Ajouter</button>
                            <button type="button" onClick={() => setIsAddPopupOpen(false)}>Annuler</button>
                        </form>
                    </div>
                )}

                {isEditPopupOpen && currentAssistant && (
                    <div className="popup">
                        <form action={handleUpdate}>
                            <input type="hidden" name="id" value={currentAssistant.id} />
                            <input name="domaine" defaultValue={currentAssistant.domaine} required />
                            <input name="role" defaultValue={currentAssistant.role} required />
                            <input name="nom" defaultValue={currentAssistant.nom} required />
                            <textarea name="description" defaultValue={currentAssistant.description} required />
                            <input name="phrase" defaultValue={currentAssistant.phrase} required />
                            <input name="image" type="file" accept="image/*" />
                            <input name="theme" defaultValue={currentAssistant.theme} required />
                            <button type="submit">Mettre à jour</button>
                            <button type="button" onClick={() => setIsEditPopupOpen(false)}>Annuler</button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}