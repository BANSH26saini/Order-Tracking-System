import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background relative">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] animate-pulse-slow" />
            </div>

            <Sidebar />

            <main className="flex-1 relative z-10 overflow-y-auto focus:outline-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
