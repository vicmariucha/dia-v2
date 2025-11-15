// dia-v2/src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { AppTextField } from "@/components/dia/AppTextField";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (formData.name.trim().split(" ").length < 2) {
      newErrors.name = "Por favor, insira seu nome completo";
      valid = false;
    }

    if (
      !formData.email.match(
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      )
    ) {
      newErrors.email = "Por favor, insira um email válido";
      valid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = () => {
    if (validateForm()) {
      // guarda dados básicos para as próximas telas
      sessionStorage.setItem(
        "signupBasic",
        JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      );

      navigate("/signup-step");
    }
  };

  return (
    <div className="min-h-screen relative grid grid-rows-[auto_1fr]">
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-[#6A0DAD] via-[#384398] to-[#008080]" />

      <CurvedHeader
        withBackground={false}
        padding="sm"
        title="Crie sua conta"
        subtitle="Dê o primeiro passo para uma melhor autogestão do diabetes."
      />

      <div className="relative -mt-2 sm:-mt-3 md:-mt-4 row-start-2">
        <div className="w-full h-full bg-card/95 border border-border rounded-t-[36px] shadow-lg">
          <div className="max-w-md mx-auto px-6 py-6">
            <div className="space-y-4">
              <AppTextField
                icon={<User size={20} />}
                type="text"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
              />

              <AppTextField
                icon={<Mail size={20} />}
                type="email"
                placeholder="exemplo@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />

              <AppTextField
                icon={<Lock size={20} />}
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
              />

              <AppTextField
                icon={<Lock size={20} />}
                type="password"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                error={errors.confirmPassword}
              />

              <PrimaryButton onClick={handleSignup} className="mt-6">
                Cadastrar
              </PrimaryButton>
            </div>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-accent font-medium hover:underline"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
