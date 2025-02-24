import { ReactNode } from 'react';
import "./global.css"

export const metadata = {
    title: "RAGS",
    description: "Assistants pour LBDD"
};

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    )
};

export default RootLayout;
