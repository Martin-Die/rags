// crudOperations.ts
import { db } from "@/app/db";
import { assistantsTable } from "@/app/db/schema";
import { eq } from 'drizzle-orm';

export interface Assistant {
    id: number;
    domaine: string;
    role: string;
    nom: string;
    description: string;
    phrase: string;
    image: Blob;
    theme: string;
}

// Fonction pour valider une couleur hexadécimale
function isValidHexColor(color: string): boolean {
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

// Fonction pour convertir un fichier en Blob
async function fileToBlob(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
            resolve(blob);
        };
        reader.onerror = () => {
            reject(new Error("Erreur lors de la lecture du fichier"));
        };
        reader.readAsArrayBuffer(file);
    });
}

export async function fetchAssistants(): Promise<Assistant[]> {
    try {
        const fetchedAssistants = await db.query.assistantsTable.findMany();
        return fetchedAssistants.map(assistant => {
            let imageBlob: Blob;
            if (assistant.image instanceof Buffer) {
                imageBlob = new Blob([assistant.image], { type: 'image/*' });
            } else if (assistant.image instanceof Blob) {
                imageBlob = assistant.image;
            } else {
                throw new Error("Type d'image non supporté");
            }

            return {
                id: assistant.id,
                domaine: assistant.domaine,
                role: assistant.role,
                nom: assistant.nom,
                description: assistant.description,
                phrase: assistant.phrase,
                image: imageBlob,
                theme: assistant.theme,
            };
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des assistants:", error);
        throw error;
    }
}

export async function addAssistant(formData: FormData): Promise<void> {
    try {
        const imageFile = formData.get('image') as File;
        const theme = formData.get('theme') as string;

        if (!imageFile || !imageFile.type.startsWith('image/')) {
            throw new Error("Veuillez sélectionner une image valide.");
        }

        if (!isValidHexColor(theme)) {
            throw new Error("Veuillez entrer une couleur hexadécimale valide (ex: #RRGGBB ou #RGB).");
        }

        const imageBlob = await fileToBlob(imageFile);

        await db.insert(assistantsTable).values({
            domaine: formData.get('domaine') as string,
            role: formData.get('role') as string,
            nom: formData.get('nom') as string,
            description: formData.get('description') as string,
            phrase: formData.get('phrase') as string,
            image: imageBlob,
            theme: theme,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'assistant:", error);
        throw error;
    }
}

export async function updateAssistant(formData: FormData, currentAssistant: Assistant | null): Promise<void> {
    try {
        const id = Number(formData.get('id'));
        const imageFile = formData.get('image') as File;
        const theme = formData.get('theme') as string;

        if (!isValidHexColor(theme)) {
            throw new Error("Veuillez entrer une couleur hexadécimale valide (ex: #RRGGBB ou #RGB).");
        }

        let imageBlob = currentAssistant?.image;
        if (imageFile && imageFile.type.startsWith('image/')) {
            imageBlob = await fileToBlob(imageFile);
        }

        await db.update(assistantsTable)
            .set({
                domaine: formData.get('domaine') as string,
                role: formData.get('role') as string,
                nom: formData.get('nom') as string,
                description: formData.get('description') as string,
                phrase: formData.get('phrase') as string,
                image: imageBlob,
                theme: theme,
            })
            .where(eq(assistantsTable.id, id));
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'assistant:", error);
        throw error;
    }
}

export async function deleteAssistant(id: number): Promise<void> {
    try {
        await db.delete(assistantsTable).where(eq(assistantsTable.id, id));
    } catch (error) {
        console.error("Erreur lors de la suppression de l'assistant:", error);
        throw error;
    }
}