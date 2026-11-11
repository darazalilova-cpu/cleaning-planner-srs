PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;
INSERT INTO Users(user_id,username) VALUES(1,'local_profile');
INSERT INTO Rooms(room_id,name) VALUES(1,'Кухня'),(2,'Ванная'),(3,'Спальня'),(4,'Гостиная'),(5,'Прихожая'),(6,'Другое');
INSERT INTO Categories(category_id,name,description) VALUES(1,'Регулярная уборка','Повторяемые домашние дела'),(2,'Генеральная уборка','Большой объём работ');
INSERT INTO Labels(label_id,name,color) VALUES(1,'Быстро','#315F4D'),(2,'Нужны средства','#C98523');
INSERT INTO Series(series_id) VALUES(1);
INSERT INTO Tasks(task_id,title,description,due_date,status,completed_at,interval_days,reminder_minutes,reminder_shown,user_id,room_id,series_id) VALUES
(1,'Протереть стол','Мягкой салфеткой','2026-11-11T09:00','completed','2026-11-11T09:10',1,0,1,1,1,1),
(2,'Протереть стол','Мягкой салфеткой','2026-11-12T09:00','pending',NULL,1,0,0,1,1,1),
(3,'Помыть окна','Подготовить средство','2026-11-15T12:00','pending',NULL,0,60,0,1,4,NULL),
(4,'Разобрать шкаф','','2026-11-18T18:00','pending',NULL,0,NULL,0,1,3,NULL);
INSERT INTO Task_Categories VALUES(1,1),(2,1),(3,2),(4,2);
INSERT INTO Task_Labels VALUES(1,1),(2,1),(3,2),(3,1);
COMMIT;
