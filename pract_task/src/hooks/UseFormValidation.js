import { useState } from 'react';

export const useFormValidation = (initialValues, validationRules) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field];
      const value = formData[field];

      for (const rule of rules) {
        const error = rule(value, formData);
        if (error) {
          newErrors[field] = error;
          break; 
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    validate,
    resetForm,
    setErrors,
  };
};

export const validationRules = {
  required: (fieldName) => (value) => {
    if (!value || !value.toString().trim()) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (fieldName, min) => (value) => {
    if (value && value.length < min) {
      return `${fieldName} must contain at least ${min} characters`;
    }
    return null;
  },

  email: (fieldName) => (value) => {
    if (value && !/\S+@\S+\.\S+/.test(value)) {
      return `Invalid ${fieldName.toLowerCase()} format`;
    }
    return null;
  },

  matchField: (fieldName, matchFieldName) => (value, formData) => {
    if (value !== formData[matchFieldName]) {
      return `${fieldName} do not match`;
    }
    return null;
  },
};