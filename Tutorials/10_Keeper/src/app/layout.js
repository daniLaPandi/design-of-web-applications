import "./globals.css";

export const metadata = {
    title: "Keeper App",
    description: "A Google Keep clone",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css?family=McLaren|Montserrat&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
