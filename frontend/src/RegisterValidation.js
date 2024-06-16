function validation(values) {
    let errors = {};

    if (!values.username) {
        errors.username = "First name is required";
    }
    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 8) {
        errors.password = "Password must be more than 8 characters";
    }
    else if (!/(?=.*[0-9])/.test(values.password)) {
        errors.password = "Password must contain a number";
    }
    else if (!/(?=.*[!@#$%^&*])/.test(values.password)) {
        errors.password = "Password must contain a special character";
    }

    return errors;
}

export default validation;