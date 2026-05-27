#!/usr/bin/env bash

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate

# Create superuser if it doesn't exist
echo "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='tanishq').exists():
    User.objects.create_superuser('tanishq', 'tanishq@breatheesg.com', 'p@ssw0rd3480')
    print('Superuser created.')
else:
    print('Superuser already exists.')
" | python manage.py shell