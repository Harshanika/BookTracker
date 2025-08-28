import ErrorBoundary from "components/ErrorBoundry";
import AppRoutes from "./routes";

function App() {
    return (
        <ErrorBoundary>
            <AppRoutes />
        </ErrorBoundary>
    );
}

export default App;
