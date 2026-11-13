# Планировщик уборки

Учебный проект по разработке приложения для домашних дел. Вариант 11.

**Выполнила:** Жалилова Дарья Ренатовна.

## Описание

«Планировщик уборки» помогает вести список домашних дел:

- добавлять, изменять и удалять дела;
- выбирать комнату и срок;
- задавать повторения и напоминания;
- отмечать выполнение и смотреть историю;
- отбирать дела с помощью фильтров.

## Цель проекта

Подготовить требования, составить план разработки и создать рабочее приложение.

## Документация

[Техническое задание](https://github.com/darazalilova-cpu/cleaning-planner-srs/wiki/Техническое-задание)

[План проекта — лабораторная работа №2](https://github.com/darazalilova-cpu/cleaning-planner-srs/wiki/План-проекта)

[Диаграмма Ганта](https://github.com/users/darazalilova-cpu/projects/1) · [Задачи](https://github.com/darazalilova-cpu/cleaning-planner-srs/issues) · [Этапы](https://github.com/darazalilova-cpu/cleaning-planner-srs/milestones)

## Рабочее приложение — лабораторная работа №3

Приложение написано на HTML, CSS и JavaScript. Дела сохраняются в текущем браузере.

**Файлы:** `index.html`, `style.css`, `script.js`, `model.js`.

**Как запустить:** скачайте архив через **Code → Download ZIP**, распакуйте и откройте `index.html`. Установка библиотек не нужна. Напоминания работают при открытом приложении.

[Процесс разработки](https://github.com/darazalilova-cpu/cleaning-planner-srs/wiki/Процесс-разработки) · [Pull Requests](https://github.com/darazalilova-cpu/cleaning-planner-srs/pulls?q=is%3Apr+is%3Amerged) · [Проверки](https://github.com/darazalilova-cpu/cleaning-planner-srs/actions) · [Релиз v1.0.0](https://github.com/darazalilova-cpu/cleaning-planner-srs/releases/tag/v1.0.0)

## Лабораторная работа №4 — База данных

Подготовлена база SQLite для хранения дел, комнат, повторений, категорий и меток.

- [Схема связей PNG](docs/database/er_diagram.png) и [SVG](docs/database/er_diagram.svg)
- [Создание таблиц](database/schema.sql)
- [Тестовые данные](database/seed_data.sql)
- [Описание нормализации](https://github.com/darazalilova-cpu/cleaning-planner-srs/wiki/normalization)

**Как проверить:** создайте пустую базу SQLite и выполните сначала `schema.sql`, затем `seed_data.sql` из папки `database`.

Приложение из работы №3 хранит дела в браузере. База SQLite подготовлена отдельно для работы №4.
