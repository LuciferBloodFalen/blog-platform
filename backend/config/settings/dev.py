import os

from dotenv import load_dotenv

from .base import *

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in .env")

DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
