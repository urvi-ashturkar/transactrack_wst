create database if not exists transactionDB;
use transactionDB;

create table if not exists team_member(
  mis char(9),
  first_name varchar(20) not null,
  last_name varchar(20) not null,
  position varchar(15) not null,
  password varchar(60) NOT NULL,
  portfolio varchar(60),
	primary key (mis)
);



create table if not exists transactions(
  transaction_id varchar(50),
  transaction_date date not null,
  amount numeric(10,2) not null,
  gst_no char(15),
  vendor varchar(50),
  team_member_id char(9),
  memo varchar(200) NOT NULL,
  primary key (transaction_id),
  foreign key (team_member_id) references team_member(mis) on delete set null
);

