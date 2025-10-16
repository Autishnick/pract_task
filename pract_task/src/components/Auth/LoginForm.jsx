import { Mail, Lock } from "lucide-react";
import {
  useFormValidation,
  validationRules,
} from "../../hooks/UseFormValidation";
import FormInput from "../common/FormInput";
import SubmitButton from "../common/SubmitButton";

const LoginForm = ({ onSubmit, isLoading = false }) => {
  const { formData, errors, handleChange, validate } = useFormValidation(
    {
      email: "",
      password: "",
    },
    {
      email: [
        validationRules.required("Email"),
        validationRules.email("Email"),
      ],
      password: [
        validationRules.required("Password"),
        validationRules.minLength("Password", 6),
      ],
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={Mail}
        placeholder="your@email.com"
      />

      <FormInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        icon={Lock}
        placeholder="••••••••"
        showPasswordToggle
      />

      <SubmitButton isLoading={isLoading}>Enter</SubmitButton>
    </form>
  );
};

export default LoginForm;
