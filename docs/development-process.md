# Процесс разработки

Лабораторная работа №3. Вариант 11 — планировщик уборки. Требования взяты из первой лабораторной, работа декомпозирована в 25 Issues второй лабораторной.

## Работа с версиями

Основная ветка main содержит объединённые изменения. Для каждого законченного блока создаётся feature-ветка, осмысленные коммиты, PR со ссылками Closes #номер, self-review и merge. Прямое переписывание истории main не используется.

| Ветка | Pull Request | Результат |
|---|---|---|
| feature/add-task-function | [#32](https://github.com/darazalilova-cpu/cleaning-planner-srs/pull/32) | Форма, валидация, создание, изменение, удаление и локальное сохранение |
| feature/recurring-reminders | [#33](https://github.com/darazalilova-cpu/cleaning-planner-srs/pull/33) | Повторения, история и напоминания; Squash and merge |
| feature/filters-and-ci | [#34](https://github.com/darazalilova-cpu/cleaning-planner-srs/pull/34) | Фильтры по сроку и автоматическая проверка качества |
| feature/database-3nf | [#35](https://github.com/darazalilova-cpu/cleaning-planner-srs/pull/35) | ER-модель, нормализация, DDL и тесты БД |
| docs/labs-2-3-4 | [#36](https://github.com/darazalilova-cpu/cleaning-planner-srs/pull/36) | План, инструкция, протокол и доступный диалог подтверждения |
| release/v1.0.0 | [#37](https://github.com/darazalilova-cpu/cleaning-planner-srs/pull/37) | Публикация проверенного релиза v1.0.0 через Actions |

Первый блок включает коммиты `feat: add basic project structure` и `feat: implement cleaning task creation editing and deletion`. Для БД отдельно сохранён `docs: add initial ER diagram` и коммит схемы. При Squash and merge PR #33 объединён в один коммит. Ключевые слова Closes автоматически закрывают связанные задачи после объединения в main.

## Self-review

Проверяются соответствие FR, корректность даты и повторений, обработка невалидных полей, безопасный вывод пользовательского текста через textContent и поведение при сбое хранилища. В PR сохраняется результат проверки. Автор не ставит собственному PR формальное Approve; для индивидуальной работы используется COMMENT-review.

## CI

`.github/workflows/ci.yml` запускается на push в main и pull_request с базой main. Job validate проверяет наличие HTML/CSS/JS, синтаксис model.js и script.js, запускает `node --test tests/model.test.cjs`, затем SQLite-тесты при наличии схемы. Права workflow ограничены `contents: read`, секреты и сторонние npm-зависимости не нужны.

Подтверждённые успешные проверки: [приложение и фильтры](https://github.com/darazalilova-cpu/cleaning-planner-srs/actions/runs/43099266506), [интеграция в main](https://github.com/darazalilova-cpu/cleaning-planner-srs/actions/runs/43100138063), [схема SQLite](https://github.com/darazalilova-cpu/cleaning-planner-srs/actions/runs/43101007748).

## Версия и релиз

v1.0.0 использует SemVer: 1 — первая версия прототипа с базовым набором домашних дел, 0 — без последующих функциональных расширений, 0 — без последующих исправляющих релизов. В релиз входят исходники приложения, тесты, план и модель БД. Это учебный прототип; проверка на всех заявленных в ТЗ версиях Chrome/Edge и на минимальном оборудовании отдельно не проводилась. Результаты реально выполненных проверок зафиксированы в verification.md.

## Изменения и сопровождение

Новая функция оформляется отдельным Issue и веткой. Ошибка исправляется через fix-коммит и PR с регрессионной проверкой. PATCH применяется к исправлениям, MINOR — к совместимым функциям, MAJOR — к несовместимому формату данных или API. Изменение формата localStorage требует явной миграции версии, повреждённые данные автоматически не очищаются.
