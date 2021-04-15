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

  validatePassword(password) {
    if (validator.isEmpty(password)) {
      return 'Password is required';
    } else if (!validator.isLength(password, { min: 8 })) {
      //remove length constraint, just check with db.
      return 'Password should be minimum 8 characters';
    }
    return false;
  }
}

const validateFields = new ValidateFields();

// export the class instance, so we can import and use it anywhere
export { validateFields };
