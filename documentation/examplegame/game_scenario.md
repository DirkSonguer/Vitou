# Proof of Concept Game

The proof of concept tries to implement a simple tanks-like game as example. The goal is to have as much game logic, data and structures dynamic as possible. Ideally everything should be changable via an online editor (changing the data files) or very easy scripting files.

For game details, see documentation in /documentation/examplegame.

## Demo scenario

We expect two clients (Player1, Player2) that connect and play together. This is the "script" they might go through from a server view.

1. Player 1: Connect to the server as socket
2. Player 1: Buy new tank (game/shop/buytank)
3. Player 1: Select new tank as main tank, still with default turret (game/meta_selecttank)
2. Player 2: Connect to the server as socket
4. Player 2: Buy new weapon turret (game/meta_buyweaponturret)
5. Player 2: Use new turret with current tank (game/meta_selectweaponturret)
6. Player 1: Open a new lobby (lobby/create)
7. Player 2: Join the lobby created by player 1 (lobby/join with lobby id)
8. Player 1: Confirms the match (lobby/confirm with lobby id)
9. Player 2: Also confirms the match (lobby/confirm with lobby id)

..

99. Player 1: Disconnect from the server
100. Player 2: Disconnect from the server
