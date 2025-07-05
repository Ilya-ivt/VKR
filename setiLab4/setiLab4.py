from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Time, ForeignKey, DECIMAL, Date
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import Optional
from datetime import time
from fastapi.middleware.cors import CORSMiddleware
from auth import hash_password, verify_password, create_access_token, get_current_user, get_db

from models import City, Company, Pharmacy, Medicine, User, Base

app = FastAPI()

origins = [
    "http://localhost:5174",
    "http://localhost:5176",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешить все источники (можно указать конкретный фронт)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic-модель для валидации данных
class CityCreate(BaseModel):
    name: str

class CompanyCreate(BaseModel):
    name: str
    city_id: int

class PharmacyCreate(BaseModel):
    number: str
    address: str
    opening_time: time
    closing_time: time
    lunch_time: Optional[time] = None
    work_schedule: Optional[str] = None
    driving_directions: Optional[str] = None

class MedicineCreate(BaseModel):
    name: str
    price: float
    quantity: int
    production_date: str
    best_before_date: str
    manufacturer_id: int
    pharmacy_id: int

# Города (city)

@app.post("/cities/")
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    new_city = City(name=city.name)
    db.add(new_city)
    db.commit()
    db.refresh(new_city)
    return new_city

@app.get("/cities/")
def get_cities(db: Session = Depends(get_db)):
    return db.query(City).all()

@app.get("/cities/{city_id}")
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

@app.put("/cities/{city_id}")
def update_city(city_id: int, city: CityCreate, db: Session = Depends(get_db)):
    db_city = db.query(City).filter(City.id == city_id).first()
    if not db_city:
        raise HTTPException(status_code=404, detail="City not found")
    db_city.name = city.name
    db.commit()
    db.refresh(db_city)
    return db_city

@app.delete("/cities/{city_id}")
def delete_city(city_id: int, db: Session = Depends(get_db)):
    db_city = db.query(City).filter(City.id == city_id).first()
    if not db_city:
        raise HTTPException(status_code=404, detail="City not found")
    db.delete(db_city)
    db.commit()
    return {"message": "City deleted"}

# Компании (company)

@app.post("/companies/")
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    new_company = Company(name=company.name, city_id=company.city_id)
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company

@app.get("/companies/")
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

@app.get("/companies/{company_id}")
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@app.put("/companies/{company_id}")
def update_company(company_id: int, company: CompanyCreate, db: Session = Depends(get_db)):
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    db_company.name = company.name
    db_company.city_id = company.city_id
    db.commit()
    db.refresh(db_company)
    return db_company

@app.delete("/companies/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(db_company)
    db.commit()
    return {"message": "Company deleted"}

# Аптеки (Pharmacy)

@app.get("/pharmacies")
def get_pharmacies(db: Session = Depends(get_db)):
    return db.query(Pharmacy).all()

@app.get("/pharmacies/{pharmacy_id}")
def get_pharmacy(pharmacy_id: int, db: Session = Depends(get_db)):
    pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    return pharmacy

@app.post("/pharmacies")
def create_pharmacy(pharmacy: PharmacyCreate, db: Session = Depends(get_db)):
    new_pharmacy = Pharmacy(**pharmacy.dict())
    db.add(new_pharmacy)
    db.commit()
    db.refresh(new_pharmacy)
    return new_pharmacy

@app.put("/pharmacies/{pharmacy_id}")
def update_pharmacy(pharmacy_id: int, pharmacy: PharmacyCreate, db: Session = Depends(get_db)):
    db_pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not db_pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    for key, value in pharmacy.dict().items():
        setattr(db_pharmacy, key, value)
    db.commit()
    db.refresh(db_pharmacy)
    return db_pharmacy

@app.delete("/pharmacies/{pharmacy_id}")
def delete_pharmacy(pharmacy_id: int, db: Session = Depends(get_db)):
    db_pharmacy = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not db_pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    db.delete(db_pharmacy)
    db.commit()
    return {"message": "Pharmacy deleted"}

# Лекартсва (Medicine)

@app.post("/medicines/")
def create_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    new_medicine = Medicine(**medicine.dict())
    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)
    return new_medicine

@app.get("/medicines/")
def get_medicines(db: Session = Depends(get_db)):
    return db.query(Medicine).all()

@app.get("/medicines/{medicine_id}")
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine

@app.put("/medicines/{medicine_id}")
def update_medicine(medicine_id: int, medicine: MedicineCreate, db: Session = Depends(get_db)):
    db_medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    for key, value in medicine.dict().items():
        setattr(db_medicine, key, value)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@app.delete("/medicines/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    db_medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(db_medicine)
    db.commit()
    return {"message": "Medicine deleted"}


class UserCreate(BaseModel):
    last_name: str
    first_name: str
    middle_name: str
    email: str
    username: str
    password: str


#Регистрация пользователя
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        middle_name=user.middle_name,
        email=user.email,
        username=user.username,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


#Авторизация (логин)
class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    token = create_access_token(data={"sub": user.username})
    return {"user": user, "token": token}


#Обновление данных пользователя
class UserUpdate(BaseModel):
    username: Optional[str] = None
    first_name: str | None
    last_name: str | None
    middle_name: str | None
    email: str | None


@app.put("/update/{username}")
def update_user(username: str, update_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_data.username and update_data.username != user.username:
        existing_user = db.query(User).filter(User.username == update_data.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        user.username = update_data.username  # Обновляем username

    if update_data.first_name:
        user.first_name = update_data.first_name
    if update_data.last_name:
        user.last_name = update_data.last_name
    if update_data.middle_name:
        user.middle_name = update_data.middle_name
    if update_data.email:
        user.email = update_data.email

    db.commit()
    db.refresh(user)
    return {"message": "User updated successfully", "user": user}


#Смена пароля
class ChangePasswordRequest(BaseModel):
    oldPassword: str
    newPassword: str
    confirmPassword: str


@app.put("/change-password/{username}")
def change_password(username: str, request: ChangePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(request.oldPassword, user.password):
        raise HTTPException(status_code=400, detail="Invalid old password")

    user.password = hash_password(request.newPassword)
    db.commit()
    return {"message": "Password changed successfully"}

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return current_user  # Возвращаем данные пользователя

