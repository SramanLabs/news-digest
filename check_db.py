import sys
sys.path.append('backend')
from database import db

users = list(db.users.find({}, {"_id": 0}))
print(f"Total Users in DB: {len(users)}")
for u in users:
    print(u)
