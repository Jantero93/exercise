docker-compose down

git fetch
git checkout master
git pull

docker-compose up --build --detach

echo Update script finished

exit 0