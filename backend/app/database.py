import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Determine DB Engine (Try Postgres, fallback to SQLite for local development convenience)
db_url = settings.DATABASE_URL

if "postgresql" in db_url:
    try:
        # Quick test connection check
        engine = create_engine(db_url, pool_pre_ping=True, connect_args={"connect_timeout": 3})
        conn = engine.connect()
        conn.close()
    except Exception as e:
        print(f"[DATABASE] Could not connect to PostgreSQL ({e}). Falling back to SQLite local database.")
        db_url = "sqlite:///./solardb.db"
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
