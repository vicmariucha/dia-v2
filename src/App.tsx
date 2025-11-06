import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupStep from "./pages/SignupStep";
import SignupPatient from "./pages/SignupPatient";
import SignupDoctor from "./pages/SignupDoctor";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordSent from "./pages/ForgotPasswordSent";
import HomePatient from "./pages/HomePatient";
import GlucoseForm from "./pages/GlucoseForm";
import GlucoseSaved from "./pages/GlucoseSaved";
import InsulinForm from "./pages/InsulinForm";
import MealForm from "./pages/MealForm";
import ActivityForm from "./pages/ActivityForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/splash" replace />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-step" element={<SignupStep />} />
          <Route path="/signup-patient" element={<SignupPatient />} />
          <Route path="/signup-doctor" element={<SignupDoctor />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/forgot-sent" element={<ForgotPasswordSent />} />
          <Route path="/home-patient" element={<HomePatient />} />
          <Route path="/glucose-form" element={<GlucoseForm />} />
          <Route path="/glucose-saved" element={<GlucoseSaved />} />
          <Route path="/insulin-form" element={<InsulinForm />} />
          <Route path="/meal-form" element={<MealForm />} />
          <Route path="/activity-form" element={<ActivityForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
