import validator from 'validator';

class ValidateFields {

  validateMis(mis) {
    const misRegex = new RegExp("[^0-9]+");

    if (validator.isEmpty(mis)) {
      return 'MIS is required';
    } else if (
      !validator.isLength(mis, { min: 9 }) ||
      !validator.isLength(mis, { max: 9 }) ||
      misRegex.test(mis)
    ){
      //also need to check with db
      return 'Invalid MIS';
    }
    return false;
  }

  validateFirstName(first_name) {
    const first_nameRegex = new RegExp("[^a-zA-Z]+");

    if (validator.isEmpty(first_name)) {
      return 'First name is required';
    } else if (
      !validator.isLength(first_name, { min: 2 }) ||
      !validator.isLength(first_name, { max: 20 }) ||
      first_nameRegex.test(first_name)
    ){
      return 'Invalid first name';
    }
    return false;
  }

  validateLastName(last_name) {
    const last_nameRegex = new RegExp("[^a-zA-Z]+");

    if (validator.isEmpty(last_name)) {
      return 'Last name is required';
    } else if (
      !validator.isLength(last_name, { min: 2 }) ||
      !validator.isLength(last_name, { max: 20 }) ||
      last_nameRegex.test(last_name)
    ){
      return 'Invalid last name';
    }
    return false;
  }

  validatePosition(position) {

    if (validator.isEmpty(position)) {
      return 'Role is required';
    } else if (
      position === " "
    ){
      return "Please specify your role";
    }
    return false;
  }

  validatePortfolio(portfolio, pos) {
    if (validator.isEmpty(portfolio) &&
      pos !== "Secretary") {
      return 'Portfolio is required';
    } else if (
      portfolio === " " &&
      pos !== "Secretary"
    ){
      return "Please specify your portfolio";
    }
    return false;
  }

  validatePassword(password) {
    if (validator.isEmpty(password)) {
      return 'Password is required';
    } else if (!validator.isLength(password, { min: 8 })) {
      //remove length constraint, just check with db.
      return 'Password should be minimum 8 characters';
    }
    return false;
  }

  validateConfirmPassword(confirm_password, pwd) {
    if (validator.isEmpty(confirm_password)) {
      return 'Password confirmation is required';
    } else if (confirm_password !== pwd) {
      return 'Password does not match';
    }
    return false;
  }
}

const validateFields = new ValidateFields();

export { validateFields };
