// LOGIN FORM VALIDATOR HELPER FN.

export const validLoginCredentials  = (formData) => {

    let errors  = {}
    const {email,password} = formData

    // check empty fields
    if(!email && !password ){
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

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }

}