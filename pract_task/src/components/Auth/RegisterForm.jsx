import { Mail, Lock, User } from "lucide-react";
import {
  useFormValidation,
  validationRules,
} from "../../hooks/UseFormValidation";
import FormInput from "../common/FormInput";
import SubmitButton from "../common/SubmitButton";
import PasswordRequirements from "../common/PasswordRequirements";

const RegisterForm = ({ onSubmit, isLoading = false }) => {
  const { formData, errors, handleChange, validate } = useFormValidation(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    {
      name: [
        validationRules.required("Name"),
        validationRules.minLength("Name", 2),
      ],
      email: [
        validationRules.required("Email"),
        validationRules.email("Email"),
      ],
      password: [
        validationRules.required("Password"),
        validationRules.minLength("Password", 6),
      ],
      confirmPassword: [
        validationRules.required("Password confirmation"),
        validationRules.matchField("Passwords", "password"),
      ],
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <FormInput
        label="Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        icon={User}
        placeholder="Your Name"
      />

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
      >
        <PasswordRequirements password={formData.password} />
      </FormInput>

      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        icon={Lock}
        placeholder="••••••••"
        showPasswordToggle
      />

      <SubmitButton isLoading={isLoading}>Register</SubmitButton>
    </form>
  );
};

export default RegisterForm;
