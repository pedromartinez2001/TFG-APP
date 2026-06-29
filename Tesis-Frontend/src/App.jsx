import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";

// Lazy load pages
const LoginForm = lazy(() => import("./pages/LoginForm"));
const RegisterForm = lazy(() => import("./pages/RegisterForm"));
const UserView = lazy(() => import("./pages/UserView"));
const ProtectedRoute = lazy(() => import("./pages/ProtectedRoute"));
const Home = lazy(() => import("./pages/Home"));
const PaginaCalc = lazy(() => import("./pages/PaginaCalc"));
const PaginaAvisos = lazy(() => import("./pages/PaginaAvisos"));
const PaginaMetasAhorro = lazy(() => import("./pages/PaginaMetasAhorro"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const TopicDetail = lazy(() => import("./components/learn/TopicDetail"));
const LessonDetail = lazy(() => import("./components/learn/LessonDetail"));

const LoadingSpinner = () => (
  <div style={{ textAlign: "center", padding: "2rem" }}>
    <p>Cargando...</p>
  </div>
);
console.log("API URL:", import.meta.env.VITE_API_URL);
const App = () => {
  return (
    <Container fluid className="app-shell">
      <Router>
        <Navigation />
        <Container fluid className="app-main">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/calculadora" element={<PaginaCalc />} />
              <Route path="/aprender" element={<LearnPage />} />
              <Route path="/aprender/:topicId" element={<TopicDetail />} />
              <Route
                path="/aprender/:topicId/:lessonId"
                element={<LessonDetail />}
              />
              <Route element={<ProtectedRoute />}>
                <Route path="/ingresos-gastos" element={<UserView />} />
                <Route path="/avisos" element={<PaginaAvisos />} />
                <Route path="/metas-ahorro" element={<PaginaMetasAhorro />} />
              </Route>
            </Routes>
          </Suspense>
        </Container>
      </Router>
      <Footer />
    </Container>
  );
};
export default App;
