from flask import Flask, render_template, request, url_for, flash, redirect, session
from forms import RegistrationForm, LoginForm, ProfileForm, RecordTxnForm, CreateProjForm, AssignTaskForm, DelegateForm, AssignBudgetForm
from flask_mysqldb import MySQL
from datetime import datetime
import hashlib

app = Flask(__name__)
app.config['SECRET_KEY'] = '6dd15af6701a5c5a38eac4409bba83dc'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'urva'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'teamDB'
app.secret_key = 'mY_sEcReT_kEy'

mysql = MySQL(app)

def hashPassword(form_password):
    salt = "5gz"
    db_password = form_password + salt
    password_hash = hashlib.md5(db_password.encode())
    return password_hash.hexdigest()

def getValue(e) :
    return e['task_deadline']

def getMyTasks():
        task_list = []

        cur = mysql.connection.cursor()
        cur.execute("SELECT task_id FROM works_on WHERE mis=%s AND discharge_date IS NULL", (session['mis'],))
        task_ids = cur.fetchall()
        if not task_ids :
            return task_list
        cur.execute("SELECT task_name FROM task WHERE task_id IN %s", (task_ids,))
        task_names = cur.fetchall()
        # print(task_names)
        cur.execute("SELECT deadline FROM task WHERE task_id IN %s", (task_ids,))
        task_deadlines = cur.fetchall()
        # print(task_deadlines)
        cur.close()

        for task_id,task_name,task_deadline in zip(task_ids,task_names,task_deadlines) :
            task_details = {
            'task_id' : '',
            'task_name' : '',
            'task_deadline' : '',
            }
            task_details['task_id'] = task_id[0]
            task_details['task_name'] = task_name[0]
            task_details['task_deadline'] = task_deadline[0]
            # print(task_details)
            task_list.append(task_details)
            task_list.sort(key = getValue)

        return task_list

@app.route("/secretary_dashboard")
def secretary_dashboard():
    task_list = getMyTasks()
    return render_template('secretary_dashboard.html', title='Secretary', session_data=session, task_list=task_list)

@app.route("/head_dashboard")
def head_dashboard():
    task_list = getMyTasks()
    return render_template('head_dashboard.html', title='Portfolio Head', session_data=session, task_list=task_list)

@app.route("/coordinator_dashboard")
def coordinator_dashboard():
    task_list = getMyTasks()
    return render_template('coordinator_dashboard.html', title='Coordinator', session_data=session, task_list=task_list)


@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        cur = mysql.connection.cursor()
        password = hashPassword(form.password.data)
        cur.execute("SELECT portfolio_id FROM portfolio WHERE portfolio_name=%s", (form.portfolio.data,))
        portfolio_id = cur.fetchone()
        cur.execute("INSERT INTO team_member(mis, first_name, last_name, email, phone, dob, cgpa, is_hostelite, join_date, position, password) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (form.mis.data, form.first_name.data, form.last_name.data, form.email.data, form.phone.data, form.dob.data, form.cgpa.data, form.is_hostelite.data, form.join_date.data, form.position.data, password))
        if form.position.data != 'Secretary' :
            cur.execute("INSERT INTO belongs_to(mis, portfolio_id, join_date) VALUES (%s, %s, %s)", (form.mis.data, portfolio_id, form.join_date.data))
        mysql.connection.commit()
        cur.close()
        flash(f'Account created for {form.mis.data}', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

#"/" is root of website
@app.route("/", methods=['GET', 'POST'])
@app.route("/login", methods=['GET', 'POST'])
def login():
    session.pop('mis', None)
    session.pop('first_name', None)
    session.pop('last_name', None)
    session.pop('username', None)
    session.pop('role', None)
    session.pop('portfolio', None)
    form = LoginForm()
    if form.validate_on_submit():
        cur = mysql.connection.cursor()
        cur.execute("SELECT password, first_name, last_name, position FROM team_member WHERE mis=%s", (form.mis.data,))
        data = cur.fetchone()
        if data :
            exp_password = data[0]
            first_name = data[1]
            last_name = data[2]
            role = data[3]
            cur.execute("SELECT portfolio_id FROM belongs_to WHERE mis=%s", (form.mis.data,))
            data = cur.fetchone()
            if data :
                portfolio_id = data[0]
                cur.execute("SELECT portfolio_name FROM portfolio WHERE portfolio_id=%s", (portfolio_id,))
                portfolio = cur.fetchone()[0]
            else :
                portfolio = ""
            cur.close
            #print(exp_password, form.password.data)
            if hashPassword(form.password.data) == exp_password :
                session['mis'] = form.mis.data
                session['first_name'] = first_name
                session['last_name'] = last_name
                session['username'] = first_name + " " + last_name
                session['role'] = role
                session['portfolio'] = portfolio
                #flash('You have been logged in!', 'success')
                if role == 'Secretary' :
                    return redirect(url_for('secretary_dashboard'))
                elif role == 'Portfolio Head' :
                    return redirect(url_for('head_dashboard'))
                elif role == 'Coordinator' :
                    return redirect(url_for('coordinator_dashboard'))
            else:
                flash('Login Unsuccessful. Please check mis and password.', 'danger')
        else :
            flash('You are not a registered team member.', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/profile", methods=['GET', 'POST'])
def profile() :
    form = ProfileForm()
    if form.validate_on_submit():
        new_password = hashPassword(form.password.data)
        cur = mysql.connection.cursor()
        cur.execute("UPDATE team_member SET first_name=%s, last_name=%s, email=%s, phone=%s, dob=%s, cgpa=%s, is_hostelite=%s, password=%s WHERE mis=%s", (form.first_name.data, form.last_name.data, form.email.data, form.phone.data, form.dob.data, form.cgpa.data, form.is_hostelite.data, new_password, session['mis']))
        mysql.connection.commit()
        cur.close()
        flash('Profile updated for %s', (session['mis'],), 'success')
        return redirect(url_for('login'))
    return render_template('profile.html', title='Profile', form=form)

@app.route("/record_txn.html", methods=['GET', 'POST'])
def record_txn() :
    form = RecordTxnForm()
    task_id = request.args.get('task_id')
    if form.validate_on_submit():
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO transaction(transaction_id, transaction_date, amount, gst_no, team_member_id, task_id) VALUES (%s, %s, %s, %s, %s, %s)", (form.transaction_id.data, form.transaction_date.data, form.amount.data, form.gst_no.data, session['mis'], task_id))
        mysql.connection.commit()
        cur.close()
        flash(f'Record saved for transaction {form.transaction_id.data}.', 'success')
        if session['role'] == 'Secretary' :
            return redirect(url_for('secretary_dashboard'))
        if session['role'] == 'Portfolio Head' :
            return redirect(url_for('head_dashboard'))
        if session['role'] == 'Coordinator' :
            return redirect(url_for('coordinator_dashboard'))
    return render_template('record_txn.html', title='Record Transaction', form=form)

@app.route("/assign_tasks.html", methods=['GET', 'POST'])
def assign_tasks() :
    form = AssignTaskForm()
    cur = mysql.connection.cursor()
    cur.execute("SELECT proj_id, proj_name FROM project")
    projects = cur.fetchall()
    print(projects)
    form.proj_id.choices = list(projects)
    print(form.proj_id.choices)
    if form.validate_on_submit():
        cur.execute("SELECT MAX(task_id) FROM task")
        task_id = cur.fetchone()[0] + 1
        if not task_id :
            task_id = 1
        cur.execute("INSERT INTO task(task_id, task_name, proj_id, start_date, deadline) VALUES (%s, %s, %s, %s, %s)", (task_id, form.task_name.data, form.proj_id.data, form.start_date.data, form.deadline.data))
        if form.portfolio_name.data == 'Self' :
            cur.execute("INSERT INTO works_on(mis, task_id, assnt_date) VALUES (%s, %s, %s)", (session['mis'], task_id, datetime.today().strftime('%Y-%m-%d')))
        else :
            cur.execute("SELECT portfolio_id FROM portfolio WHERE portfolio_name=%s", (form.portfolio_name.data,))
            portfolio_id = cur.fetchone()
            cur.execute("SELECT mis FROM team_member WHERE position='Portfolio Head'")
            heads = cur.fetchall()
            print(heads)
            cur.execute("SELECT mis FROM belongs_to WHERE mis IN %s and portfolio_id=%s", (heads, portfolio_id))
            portfolio_heads = cur.fetchall()
            print(portfolio_heads)
            for head in portfolio_heads :
                cur.execute("INSERT INTO works_on(mis, task_id, assnt_date) VALUES (%s, %s, %s)", (head[0], task_id, datetime.today().strftime('%Y-%m-%d')))
        mysql.connection.commit()
        cur.close()
        flash(f'New task assigned.', 'success')
        return redirect(url_for('secretary_dashboard'))
    return render_template('assign_tasks.html', title='Assign Tasks', form=form)

@app.route("/delegate.html", methods=['GET', 'POST'])
def delegate() :
    form = DelegateForm()
    task_id = request.args.get('task_id')
    cur = mysql.connection.cursor()
    cur.execute("SELECT mis FROM team_member WHERE position='Coordinator'")
    coords = cur.fetchall()
    print(coords)
    cur.execute("SELECT portfolio_id FROM portfolio WHERE portfolio_name=%s", (session['portfolio'],))
    portfolio_id = cur.fetchone()[0]
    cur.execute("SELECT mis FROM belongs_to WHERE mis IN %s and portfolio_id=%s", (coords, portfolio_id))
    portfolio_coord_ids = cur.fetchall()
    coords = []
    for id in portfolio_coord_ids :
        cur.execute("SELECT first_name FROM team_member WHERE mis=%s", (id,))
        coord_name = cur.fetchone()[0]
        cur.execute("SELECT last_name FROM team_member WHERE mis=%s", (id,))
        coord_name = coord_name + " " + cur.fetchone()[0]
        coords.append((id[0], coord_name))
    form.mis.choices = coords
    print(coords)
    if form.validate_on_submit():
        print(task_id, form.mis.data, session['mis'])
        cur.execute("INSERT INTO works_on(mis, task_id, assnt_date) VALUES(%s, %s, %s)", (form.mis.data, task_id, datetime.today().strftime('%Y-%m-%d')))
        cur.execute("UPDATE works_on SET discharge_date=%s WHERE mis=%s and task_id=%s", (datetime.today().strftime('%Y-%m-%d'), session['mis'], task_id))
        mysql.connection.commit()
        cur.close()
        flash(f'Task delegated.', 'success')
        return redirect(url_for('head_dashboard'))
    return render_template('delegate.html', title='Delegate Task', form=form)


@app.route("/create_projects.html", methods=['GET', 'POST'])
def create_projects() :
    form = CreateProjForm()
    if form.validate_on_submit():
        cur = mysql.connection.cursor()
        cur.execute("SELECT MAX(proj_id) FROM project")
        proj_id = cur.fetchone()[0] + 1
        if not proj_id :
            proj_id = 1
        cur.execute("INSERT INTO project(proj_id, proj_name, start_date, deadline) VALUES (%s, %s, %s, %s)", (proj_id, form.proj_name.data, form.start_date.data, form.deadline.data))
        mysql.connection.commit()
        cur.close()
        flash(f'New project created.', 'success')
        if session['role'] == 'Secretary' :
            return redirect(url_for('secretary_dashboard'))
        if session['role'] == 'Portfolio Head' :
            return redirect(url_for('head_dashboard'))
        if session['role'] == 'Coordinator' :
            return redirect(url_for('coordinator_dashboard'))
    return render_template('create_projects.html', title='Create Projects', form=form)

@app.route("/assign_budgets.html", methods=['GET', 'POST'])
def assign_budgets() :
    form = AssignBudgetForm()
    if form.validate_on_submit():
        cur = mysql.connection.cursor()
        cur.execute("SELECT portfolio_id FROM portfolio WHERE portfolio_name=%s", (form.portfolio_name.data,))
        portfolio_id = cur.fetchone()[0]
        cur.execute("UPDATE portfolio SET budget=%s WHERE portfolio_id=%s", (form.budget.data, portfolio_id))
        mysql.connection.commit()
        cur.close()
        flash(f'Budget assigned to {form.portfolio_name.data}.', 'success')
        return redirect(url_for('secretary_dashboard'))
    return render_template('assign_budgets.html', title='Assign Budgets', form=form)

if __name__ == '__main__':
    app.run(debug=True)
