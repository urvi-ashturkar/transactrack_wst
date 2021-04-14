from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, DateField, DecimalField, SelectField, PasswordField, SubmitField, BooleanField, HiddenField
from wtforms.validators import InputRequired, Length, Email, EqualTo, Regexp, NumberRange, NoneOf


class RegistrationForm(FlaskForm):
    mis = StringField('MIS ID',
                        validators=[InputRequired(), Regexp('[0-9]+'), Length(min=9, max=9)])
    first_name = StringField('First Name',
                           validators=[InputRequired(), Regexp('[a-zA-Z]+'), Length(min=2, max=20)])
    last_name = StringField('Last Name',
                           validators=[InputRequired(), Regexp('[a-zA-Z]+'), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[InputRequired(), Email(), Length(max=60)])
    phone = StringField('Phone no.',
                        validators=[InputRequired(), Regexp('[0-9]+'), Length(min=10, max=10)])
    dob = DateField('DOB YYYY-MM-DD',
                    validators=[InputRequired()])
    cgpa = DecimalField('Current CGPA',
                            validators=[InputRequired(), NumberRange(min=4.00, max=10.00)])
    is_hostelite = BooleanField('I reside in COEP hostel.')
    join_date = DateField('Date of joining the team YYYY-MM-DD',
                    validators=[InputRequired()])
    position = SelectField('Your role in the team', choices=[('Coordinator'), ('Portfolio Head'), ('Secretary'), ('')],
                            default='', validators=[InputRequired(), NoneOf('')])
    portfolio = SelectField('Portfolio', choices=[('Events'), ('Finance'), ('Design'), ('Media'), ('Accounts'), ('COG'), ('Publicity'), ('Web'), ('Documentation'), ('Infrastructure'), ('Logistics'), ('Security'), ('')],
                            default='', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    confirm_password = PasswordField('Re-enter Password',
                                     validators=[InputRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')


class LoginForm(FlaskForm):
    mis = StringField('MIS ID',
                        validators=[InputRequired(), Regexp('[0-9]+'), Length(min=9, max=9)])
    password = PasswordField('Password', validators=[InputRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class ProfileForm(FlaskForm) :
    first_name = StringField('First Name',
                           validators=[InputRequired(), Regexp('[a-zA-Z]+'), Length(min=2, max=20)])
    last_name = StringField('Last Name',
                           validators=[InputRequired(), Regexp('[a-zA-Z]+'), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[InputRequired(), Email(), Length(max=60)])
    phone = StringField('Phone no.',
                        validators=[InputRequired(), Regexp('[0-9]+'), Length(min=10, max=10)])
    dob = DateField('DOB YYYY-MM-DD',
                    validators=[InputRequired()])
    cgpa = DecimalField('Current CGPA',
                            validators=[InputRequired(), NumberRange(min=4.00, max=10.00)])
    is_hostelite = BooleanField('I reside in COEP hostel.')
    password = PasswordField('Password', validators=[InputRequired()])
    confirm_password = PasswordField('Re-enter Password',
                                     validators=[InputRequired(), EqualTo('password')])
    submit = SubmitField('Save changes')

class RecordTxnForm(FlaskForm) :
    transaction_id = StringField('Transaction Reference ID',
                        validators=[InputRequired(), Regexp('[0-9A-Za-z]+'), Length(min=12, max=12)])
    transaction_date = DateField('Transaction date YYYY-MM-DD',
                    validators=[InputRequired()])
    amount = DecimalField('Transaction Amount(-ve for expenditure)',
                            validators=[InputRequired()])
    gst_no = StringField('GST No.',
                        validators=[InputRequired(), Regexp('[0-9][0-9][0-9A-Z]' + '[0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z]' + '[0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z]' + '[0-9A-Z][0-9]Z[0-9A-Z]'),
                                    Length(min=15, max=15)])
    submit = SubmitField('Save')

class CreateProjForm(FlaskForm) :
    proj_name = StringField('Project Name',
                        validators=[InputRequired(), Length(max=60)])
    start_date = DateField('Start date YYYY-MM-DD',
                    validators=[InputRequired()])
    deadline = DateField('Project Deadline YYYY-MM-DD',
                    validators=[InputRequired()])
    submit = SubmitField('Save')

class AssignTaskForm(FlaskForm) :
    proj_id = SelectField('Create Task under Project',
                        validators=[InputRequired()])
    task_name = StringField('Task Name',
                        validators=[InputRequired(), Length(max=60)])
    portfolio_name = SelectField('Assign to Portfolio', choices=[('Self'), ('Events'), ('Finance'), ('Design'), ('Media'), ('Accounts'), ('COG'), ('Publicity'), ('Web'), ('Documentation'), ('Infrastructure'), ('Logistics'), ('Security')],
                            validators=[InputRequired()])
    start_date = DateField('Start date YYYY-MM-DD',
                    validators=[InputRequired()])
    deadline = DateField('Project Deadline YYYY-MM-DD',
                    validators=[InputRequired()])
    submit = SubmitField('Save')

class DelegateForm(FlaskForm) :
    mis = SelectField('Delegate to coordinator',
                        validators=[InputRequired()])
    submit = SubmitField('Confirm')

class AssignBudgetForm(FlaskForm) :
    portfolio_name = SelectField('Portfolio', choices=[('Events'), ('Finance'), ('Design'), ('Media'), ('Accounts'), ('COG'), ('Publicity'), ('Web'), ('Documentation'), ('Infrastructure'), ('Logistics'), ('Security')],
                                validators=[InputRequired()])
    budget = DecimalField('Budget amount',
                        validators=[InputRequired()])
    submit = SubmitField('Confirm')
