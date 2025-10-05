insert into public.tournaments (year, name) values
(2024, '1ere édition'),
(2025, '2eme édition');

insert into public.players (name, tel) values
('Kevin Verschaeve', '0617189071'),
('Fanny Cloet', '0617189072'),
('Charly Aghetti', '0617189073'),
('Jeremy Samson', '0617189074');

insert into public.teams (name, player1, player2) values
('Les petits pedestres', 1, 2),
('Les Symfonystes', 3, 4);

insert into public.tournament_teams (tournament, team) values
(1, 1),
(1, 2),
(2, 1),
(2, 2);

insert into public.matchs (tournament, team1, team2, month) values
(2, 1, 2, 1);

insert into public.match_scores (match, score_team1, score_team2) values
(1, 1130, 250),
(1, 1020, 500),
(1, 980, 1050);
