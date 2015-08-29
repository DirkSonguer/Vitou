read -p "This will delete all current game code and data! Are you sure?" -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
{
	rm ./testserver.js
	rm ./data/assemblages/*
	rm ./data/components/*
	rm ./data/gamedata/*
	rm -rf ./game_modules/*
	rm -rf ./views
} &> /dev/null
echo
echo "Done."
fi