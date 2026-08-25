import * as Yup from 'yup';

export const codeSchema = Yup.object().shape({
  schoolCode: Yup.string()
    .trim()
    .required('School code is required')
});
export const loginSchema = Yup.object().shape({
  // email: Yup.string().email('Invalid email').required('Email is required'),
  // email: Yup.string().required('Email / CNIC / Phone is required'),
  email: Yup.string()
    .transform((value) => (value ? value.trim() : value)) // Ye start aur end ki spaces remove kar dega
    .required('Email / CNIC / Phone is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});


export const signupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup
    .string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
  confirmPassword: Yup
    .string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'At least one uppercase letter required')
    .matches(/[a-z]/, 'At least one lowercase letter required')
    .matches(/[0-9]/, 'At least one number required')
    .matches(/[!@#$%^&*]/, 'At least one special character required'),

  confirmPassword: Yup
    .string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});