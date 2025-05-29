import * as Yup from 'yup'
const SignUpValidation = 
Yup.object({

    username: Yup.string()
     .transform((value) => (value ? value.trim() : value))
     .required('Username is required'),
    email: Yup.string()
     .transform((value) => (value ? value.trim() : value))
     .email('Invalid email')
     .required('Email is required'),

    password: Yup.string()
     .transform((value) => (value ? value.trim() : value))
     .min(8, 'Password must be at least 8 characters')
     .matches(
         /^(?=.*[A-Z])(?=.*[0-9!@#$%^&*()-_=+{};:'",.<>?/\\|[\]`~])/,
         'Password must contain at least one uppercase letter and one number or special character')
     .required('Password is required'),

     confirmPassword: Yup.string()
     .transform((value) => (value ? value.trim() : value))
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    
      isVendor: Yup.boolean()
       .transform((value) => value === 'true' ? true : false)
      .required('User Type is required'),

      address: Yup.string()
    .transform((value) => (value ? value.trim() : value))
    .required('Address is required'),
    
  phoneNumber: Yup.string()
    .transform((value) => (value ? value.trim() : value))
    .matches(/^\d{4}-\d{7}$/, 'Invalid phone number format (####-#######)')
    .required('Phone Number is required'),

})


export default SignUpValidation
