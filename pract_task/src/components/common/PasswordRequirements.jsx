import { CheckCircle, AlertCircle } from "lucide-react";

const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: "Minimum 6 symbols", check: (pwd) => pwd.length >= 6 },
  ];

  if (!password) return null;

  return (
    <div className="space-y-1 mt-2">
      {requirements.map((req, index) => {
        const isValid = req.check(password);
        return (
          <div key={index} className="flex items-center gap-2 text-sm">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-gray-400" />
            )}
            <span className={isValid ? "text-green-600" : "text-gray-600"}>
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordRequirements;
