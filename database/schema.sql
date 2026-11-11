-- SQLite 3. Model of Cleaning Planner, variant 11. Local wall-clock timestamps.
PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;
CREATE TABLE Users (
 user_id INTEGER PRIMARY KEY,
 username TEXT NOT NULL UNIQUE CHECK(length(trim(username)) > 0),
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE Rooms (
 room_id INTEGER PRIMARY KEY,
 name TEXT NOT NULL UNIQUE CHECK(length(trim(name)) > 0)
);
CREATE TABLE Categories (
 category_id INTEGER PRIMARY KEY,
 name TEXT NOT NULL UNIQUE,
 description TEXT NOT NULL DEFAULT ''
);
CREATE TABLE Labels (
 label_id INTEGER PRIMARY KEY,
 name TEXT NOT NULL UNIQUE,
 color TEXT NOT NULL CHECK(length(color)=7 AND substr(color,1,1)='#' AND substr(color,2) NOT GLOB '*[^0-9A-Fa-f]*')
);
CREATE TABLE Series (
 series_id INTEGER PRIMARY KEY,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE Tasks (
 task_id INTEGER PRIMARY KEY,
 title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 100),
 description TEXT NOT NULL DEFAULT '' CHECK(length(description)<=500),
 due_date TEXT NOT NULL CHECK(length(due_date)=16 AND due_date GLOB '????-??-??T??:??' AND datetime(due_date) IS NOT NULL),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','completed')),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 completed_at TEXT,
 interval_days INTEGER NOT NULL DEFAULT 0 CHECK(typeof(interval_days)='integer' AND interval_days BETWEEN 0 AND 365),
 reminder_minutes INTEGER CHECK(reminder_minutes IS NULL OR reminder_minutes IN (0,15,60)),
 reminder_shown INTEGER NOT NULL DEFAULT 0 CHECK(reminder_shown IN (0,1)),
 user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
 room_id INTEGER NOT NULL REFERENCES Rooms(room_id) ON DELETE RESTRICT,
 series_id INTEGER REFERENCES Series(series_id) ON DELETE RESTRICT,
 CHECK((status='pending' AND completed_at IS NULL) OR (status='completed' AND completed_at IS NOT NULL AND datetime(completed_at) IS NOT NULL)),
 CHECK((interval_days=0 AND series_id IS NULL) OR (interval_days>0 AND series_id IS NOT NULL))
);
CREATE TABLE Task_Categories (
 task_id INTEGER NOT NULL REFERENCES Tasks(task_id) ON DELETE CASCADE,
 category_id INTEGER NOT NULL REFERENCES Categories(category_id) ON DELETE CASCADE,
 PRIMARY KEY(task_id,category_id)
);
CREATE TABLE Task_Labels (
 task_id INTEGER NOT NULL REFERENCES Tasks(task_id) ON DELETE CASCADE,
 label_id INTEGER NOT NULL REFERENCES Labels(label_id) ON DELETE CASCADE,
 PRIMARY KEY(task_id,label_id)
);
CREATE INDEX idx_tasks_user_due ON Tasks(user_id,due_date);
CREATE INDEX idx_tasks_status ON Tasks(status);
CREATE INDEX idx_tasks_room_due ON Tasks(room_id,due_date);
CREATE INDEX idx_tasks_series ON Tasks(series_id);
CREATE INDEX idx_categories_tasks ON Task_Categories(category_id);
CREATE INDEX idx_labels_tasks ON Task_Labels(label_id);
CREATE UNIQUE INDEX uq_active_series ON Tasks(series_id) WHERE status='pending' AND series_id IS NOT NULL;
COMMIT;
