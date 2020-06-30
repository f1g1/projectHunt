This application is a treasure hunt platform that is working, with React, Ionic, Capacitor, and Firebase

It allows anything related to a treasure hunt game, from creating a game template, creating a lobby,
and also the game in itself.

Some possible workflows are:

<b>Create game:</b>

Here you can set various informations about your wanted games, and also insert the challenges that you want, the challenges can be text, free text, QR, photo, and
validated photo.You can control a lot of feautres of the challenges from the location, points, if allows only one chance, the feedback that it offers to the players etc.

<b>Create lobby</b>
After the desired game is created, you can create a lobby, here you can create team for players to join, can comunicate through chat, you can kick/mute/ban players
that don't behave or that are not allowed to play, etc.

<b>Play game (Admin)</b>
After you start the game, you can set points on the map, (Admin points), you can modify the game area and the breadcrumbs that the players are supposed to follow
you have acces to the points of every team, you can add bonus points/ penalities and also you can mark some challenges as done or undone, regardless of theyr state,
you can see all the answers that this team gave, and also see the challenges that they succeded/failed. You have acces to a list with the game's challenges, and the
specified informations, you can add a new challenge in the game, you can approve/cancel a pending challenge from the players that require validation etc.

<b>Play game (Player)</b>
As a player, after the game start, you have the posibilites to see the active challenges (this depending of the game type can be 1 or more) and you can see the game map
you can check in your position, see the check-ins of other teams, and also the location of active challenges, you can also change the view on the completed challenges
so you can see how many and which challenges you completed, and their feedback.You have acces to the chat, in which you can communicate with all players/team/admin.
If one of the players from your team is answering wrong, all willl receive the challenge delay for that challenge.

and more

run live reload =>
ionic capacitor run android -l --address=0.0.0.0
