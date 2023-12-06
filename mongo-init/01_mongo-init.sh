set -e

mongosh <<EOF
db = db.getSiblingDB('$DB_NAME')

db.createUser({
  user: '$DB_USERNAME',
  pwd: '$DB_PASSWORD',
  roles: [{ role: 'readWrite', db: '$DB_NAME' }],
});
EOF

