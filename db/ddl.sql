use teamDB

create table if not exists team_member(
  mis char(9),
	first_name varchar(20) not null,
  last_name varchar(20) not null,
	email varchar(60) not null,
	phone char(10) not null,
	dob date,
  cgpa numeric(3,2),
  is_hostelite bit(1),
  join_date date,
  leave_date date,
  position varchar(15) not null,
  password char(32) not null,
	primary key (mis)
);

create table if not exists portfolio(
  portfolio_id tinyint(2) unsigned,
  portfolio_name varchar(40) not null,
  budget numeric(10,2) unsigned,
  primary key (portfolio_id)
);

create table if not exists project(
  proj_id smallint(3) unsigned,
  proj_name varchar(60) not null,
  start_date date,
  end_date date,
  deadline date,
  primary key (proj_id)
);

create table if not exists task(
  task_id smallint(3) unsigned,
  task_name varchar(60) not null,
  proj_id smallint(3) unsigned,
  start_date date,
  end_date date,
  deadline date,
  primary key (task_id),
  foreign key (proj_id) references project(proj_id) on delete cascade
);

create table if not exists vendor(
  gst_no char(15),
  vendor_name varchar(60) not null,
  primary key (gst_no)
  -- constraint check_gst_no check
  -- (
  --   gst_no like '[0-9][0-9][0-9A-Z]' + '[0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z]' + '[0-9A-Z][0-9A-Z][0-9A-Z][0-9A-Z]' + '[0-9A-Z][0-9]Z[0-9A-Z]'
  -- )
);

create table if not exists transaction(
  transaction_id varchar(50),
  transaction_date date not null,
  amount numeric(10,2) not null,
  gst_no char(15),
  team_member_id char(9),
  task_id smallint(3) unsigned,
  primary key (transaction_id),
  foreign key (gst_no) references vendor(gst_no) on delete set null,
  foreign key (team_member_id) references team_member(mis) on delete set null,
  foreign key (task_id) references task(task_id) on delete set null
);

create table if not exists belongs_to(
  mis char(9),
  portfolio_id tinyint(2) unsigned,
  join_date date,
  leave_date date,
  primary key (mis,portfolio_id),
  foreign key (mis) references team_member(mis) on delete cascade,
  foreign key (portfolio_id) references portfolio(portfolio_id) on delete cascade
);

create table if not exists works_on(
  mis char(9),
  task_id smallint(3) unsigned,
  assnt_date date,
  discharge_date date,
  primary key (mis,task_id),
  foreign key (mis) references team_member(mis) on delete cascade,
  foreign key (task_id) references task(task_id) on delete cascade
);
