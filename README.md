# Планировщик уборки

Учебный проект по разработке приложения для домашних дел. Вариант 11.

**Выполнила:** Жалилова Дарья Ренатовна.

## Описание

Приложение помогает планировать уборку: добавлять дела, указывать комнату и срок, настраивать повторения и напоминания. Дела можно изменять, удалять, фильтровать и отмечать выполненными.

[Техническое задание](https://github.com/darazalilova-cpu/cleaning-planner-srs/wiki/Техническое-задание)

## Лабораторная работа №2 — Планирование проекта

Составлен план из 25 задач с оценками, сроками, ролями и зависимостями.

- [План проекта и участник](https://github.com/darazalilova-cpu/cleaning-planner-srs/wiki/План-проекта)
- [GitHub Project — диаграмма Ганта](https://github.com/users/darazalilova-cpu/projects/1)
- [Задачи](https://github.com/darazalilova-cpu/cleaning-planner-srs/issues?q=is%3Aissue+WBS+in%3Atitle) и [контрольные точки](https://github.com/darazalilova-cpu/cleaning-planner-srs/milestones)

Project открыт для публичного просмотра. [Полный календарный план](docs/project-plan.md).

## Лабораторная работа №3 — Рабочее приложение

Приложение написано на HTML, CSS и JavaScript. Данные сохраняются в браузере.

**Как запустить:** нажмите **Code → Download ZIP**, распакуйте архив и откройте `index.html` в браузере. Установка библиотек не нужна. Напоминания работают, пока приложение открыто.

- [Процесс разработки](https://github.com/darazalilova-cpu/cleaning-planner-srs/wiki/Процесс-разработки)
- [Pull Requests](https://github.com/darazalilova-cpu/cleaning-planner-srs/pulls?q=is%3Apr+is%3Amerged) и [автоматические проверки](https://github.com/darazalilova-cpu/cleaning-planner-srs/actions)
- [Релиз v1.0.0](https://github.com/darazalilova-cpu/cleaning-planner-srs/releases/tag/v1.0.0)

## Лабораторная работа №4 — База данных

Спроектирована база данных SQLite, приведённая к третьей нормальной форме (3НФ).

- [ER-диаграмма PNG](docs/database/er_diagram.png) и [SVG](docs/database/er_diagram.svg)
- [SQL-схема](database/schema.sql) и [тестовые данные](database/seed_data.sql)
- [Нормализация базы данных](https://github.com/darazalilova-cpu/cleaning-planner-srs/wiki/normalization)

**Как проверить:** выполните в SQLite сначала `database/schema.sql`, затем `database/seed_data.sql`.

База SQLite подготовлена для лабораторной №4. Браузерное приложение хранит дела в `localStorage`.

Подробности проверок и команды для запуска тестов: [протокол](docs/verification.md).
