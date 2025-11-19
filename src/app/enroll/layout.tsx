'';

export default function EnrollLayout({ children }: { children: React.ReactNode }) {

    return (
        <main className="min-h-screen flex items-center justify-center bg-primary/10">
            {children}
        </main>
    );
}
