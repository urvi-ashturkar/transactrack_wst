import validator from 'validator';

function isFutureDate(idate){
  var today = new Date().getTime();
  idate = new Date(idate).getTime();
  return (today - idate) < 0;
}

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

  validateEmail(email) {

    if (validator.isEmpty(email)) {
      return 'Email is required';
    } else if (!validator.isEmail(email)) {
      return 'Invalid Email';
    }
    return false;
  }

  validatePhone(phone) {
    const phoneRegex = new RegExp("[^0-9]+");

    if (validator.isEmpty(phone)) {
      return 'Phone no. is required';
    } else if (
      !validator.isLength(phone, { min: 10 }) ||
      !validator.isLength(phone, { max: 10 }) ||
      phoneRegex.test(phone)
    ){
      return 'Invalid phone no.';
    }
    return false;
  }

  validateDob(dob) {

    if (validator.isEmpty(dob)) {
      return 'DOB is required';
    } else if (
      isFutureDate(dob) === true
    ){
      return 'Invalid DOB';
    }
    return false;
  }

  validateCgpa(cgpa) {
    const cgpaRegex = new RegExp("[^\d*(\.\d{0,2})?$]");

    if (validator.isEmpty(cgpa)) {
      return 'CGPA is required';
    } else if (
      cgpa < 4.00 ||
      cgpa > 10.00 ||
      !cgpaRegex.test(cgpa)
    ){
      //also need to check with db
      return 'Invalid CGPA';
    }
    return false;
  }

  validateIsHostelite(is_hostelite) {
    return false;
  }

  validateJoinDate(join_date) {

    if (validator.isEmpty(join_date)) {
      return 'Join date is required';
    } else if (
      isFutureDate(join_date) === true
    ){
      return 'Invalid join date';
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
    console.log(pos);

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
      console.log(pwd);
      console.log(confirm_password);
      return 'Password does not match';
    }
    return false;
  }
}

const validateFields = new ValidateFields();

export { validateFields };
