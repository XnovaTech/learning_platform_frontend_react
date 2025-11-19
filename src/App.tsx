import { AppRouter } from "@/routes/AppRouter";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <AuthProvider>
          <AppRouter />
          <Toaster richColors closeButton position="top-center"  />
        </AuthProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  );
}

export default App;
