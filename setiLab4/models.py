from sqlalchemy import create_engine, Column, Integer, String, Time, ForeignKey, DECIMAL, Date
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.orm import declarative_base


Base = declarative_base()

class City(Base):
    __tablename__ = "cities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"))
    city = relationship("City")

class Pharmacy(Base):
    __tablename__ = "pharmacies"
    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True, nullable=False)
    address = Column(String, nullable=False)
    opening_time = Column(Time, nullable=False)
    closing_time = Column(Time, nullable=False)
    lunch_time = Column(Time, nullable=True)
    work_schedule = Column(String, nullable=True)
    driving_directions = Column(String, nullable=True)

class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)  # Указываем точность для Decimal
    quantity = Column(Integer, nullable=False)
    production_date = Column(Date, nullable=False)
    best_before_date = Column(Date, nullable=False)
    manufacturer_id = Column(Integer, ForeignKey("companies.id"))
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"))
    manufacturer = relationship("Company")
    pharmacy = relationship("Pharmacy")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    last_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)