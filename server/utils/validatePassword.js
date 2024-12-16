import validator from 'validator';




export const validatePassword = (password) => {
  const errors = [];

  if (!validator.isLength(password, { min: 8 })) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must include at least one lowercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must include at least one number.");
  }
  if (!/[@$!%*?&#]/.test(password)) {
    errors.push("Password must include at least one special character.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};


