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
import CarbCalculator from "./pages/CarbCalculator";
import NotFound from "./pages/NotFound";

import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorPatient from "./pages/doctor/Patient";

import Perfil from "./pages/Perfil";
import MyDoctor from "./pages/MyDoctor";
import DoctorDetail from "./pages/DoctorDetail";
import History from "./pages/History";

import DoctorProfile from "@/pages/doctor/DoctorProfile";

import PatientDoctorChat from "./pages/DoctorChat";
import DoctorChat from "./pages/doctor/DoctorChat";

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

          {/* PACIENTE */}
          <Route path="/home-patient" element={<HomePatient />} />
          <Route path="/glucose-form" element={<GlucoseForm />} />
          <Route path="/glucose-saved" element={<GlucoseSaved />} />
          <Route path="/insulin-form" element={<InsulinForm />} />
          <Route path="/meal-form" element={<MealForm />} />
          <Route path="/activity-form" element={<ActivityForm />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/my-doctor" element={<MyDoctor />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />
          <Route path="/chat/:id" element={<PatientDoctorChat />} />
          <Route path="/history" element={<History />} />
          <Route path="/carb-calculator" element={<CarbCalculator />} />

          {/* MÉDICO */}
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/patient/:id" element={<DoctorPatient />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/chat" element={<DoctorChat />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
