import * as Yup from 'yup';

export const homeworkSchema = Yup.object().shape({
  date: Yup
    .date()
    .typeError('Please select homework date')
    .required('Homework date is required'),

  description: Yup
    .string()
    .trim()
    .required('Homework description is required')
    .min(5, 'Description must be at least 5 characters'),
});



export const attendanceSchema = Yup.object({
  selectedDate: Yup
    .date()
    .typeError("Please select a valid date")
    .required("Attendance date is required"),
});


/* ---------------- Validation ---------------- */
export const updatePasswordschema = Yup.object().shape({
  currentPassword: Yup
    .string()
    .required('Current password is required'),

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