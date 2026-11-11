"""Executable checks for the lab 4 schema. No third-party dependencies."""
from pathlib import Path
import sqlite3
import unittest

ROOT = Path(__file__).resolve().parents[1]

class DatabaseTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(':memory:')
        self.db.executescript((ROOT/'database/schema.sql').read_text(encoding='utf-8'))
        self.db.executescript((ROOT/'database/seed_data.sql').read_text(encoding='utf-8'))

    def tearDown(self):
        self.db.close()

    def test_seed_and_foreign_keys(self):
        self.assertEqual(self.db.execute('PRAGMA foreign_key_check').fetchall(), [])
        self.assertEqual(self.db.execute('SELECT count(*) FROM Tasks').fetchone()[0], 4)
        for table in ['Users','Rooms','Categories','Labels','Series','Tasks','Task_Categories','Task_Labels']:
            self.assertGreater(self.db.execute(f'SELECT count(*) FROM {table}').fetchone()[0], 0)

    def test_invalid_values(self):
        for sql in ["UPDATE Tasks SET title=' ' WHERE task_id=2", "UPDATE Tasks SET interval_days=366 WHERE task_id=2", "UPDATE Tasks SET user_id=99 WHERE task_id=2", "UPDATE Tasks SET status='completed' WHERE task_id=2", "INSERT INTO Task_Labels VALUES(3,1)"]:
            with self.assertRaises(sqlite3.IntegrityError):
                self.db.execute(sql)
            self.db.rollback()

    def test_one_active_occurrence(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO Tasks(title,due_date,interval_days,user_id,room_id,series_id) VALUES('Дубликат','2026-11-13T09:00',1,1,1,1)")

    def test_cascade_keeps_other_history(self):
        self.db.execute('DELETE FROM Tasks WHERE task_id=2')
        self.assertEqual(self.db.execute('SELECT count(*) FROM Task_Labels WHERE task_id=2').fetchone()[0], 0)
        self.assertEqual(self.db.execute('SELECT status FROM Tasks WHERE task_id=1').fetchone()[0], 'completed')

    def test_indexes(self):
        indexes={x[1] for x in self.db.execute("PRAGMA index_list('Tasks')")}
        self.assertTrue({'idx_tasks_user_due','idx_tasks_status','idx_tasks_room_due','uq_active_series'} <= indexes)

if __name__ == '__main__':
    unittest.main(verbosity=2)
