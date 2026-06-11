// SIGNUP FORM VALIDATION HELPER FN.

export const validateSignUpCredentials = (creds) => {
    // console.log("Started Signup Form validation")
    let errors = {}

    const {email,password,confirm_password} = creds

    // check empty fields
    if(!email && !password && !confirm_password){
        errors.empty_fields = "all fields are required";
    }

    // check email format
    if(email){
        if(!email.includes('@')){
            errors.email = "Email must contain '@' ";
        }
        else if(!email.endsWith('@gmail.com')){
            errors.email = "Email must end with '@gmail.com' ";
        }
    }

    // Check for password length

    if(password){
        if(password.length < 6 || password.length > 8){
            errors.password = 'Password must be between 6 - 8 characters.';
        }
    }

    // Checks for password letters and numbers only

   if(password){
     for(let char of password){

        const isLetter = (char >= "a" && char <='z' ) || (char >= 'A' && char <= 'Z');
        
        const isNumber = (char >= '0' && char <= '9');

        if(!isLetter && !isNumber){
            errors.password = "Password can only contain characters and numbers.";
            break;
        }
    }   
   }

    if(password !== confirm_password){
        errors.confirm_password = "password and confirm password does not match.";
    }
    
    return {
        isValid:Object.keys(errors).length === 0,
        errors,
    };
};