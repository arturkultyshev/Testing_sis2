# AI tool and prompts

## Tool disclosure

- Tool used: **OpenAI Codex desktop app**, in the chat used to prepare this assignment.
- Model: **GPT-6.1 Sol (`gpt-6.1-sol`)**. Reasoning effort: **Low (лёгкий)**. The student confirmed the displayed selection in this conversation: `gpt 6.1 sol легкое`.
- Session date: 17 October 2026, Asia/Almaty.
- AI assistance: explaining the brief, choosing the project structure, inspecting the live demo, writing TypeScript and Markdown, running and correcting tests, and collecting evidence.
- No separate Claude, Gemini or other AI tool was used by the assistant for this work. Browser automation and command execution were tools used by Codex, not additional human prompts to another model.

The model/effort entry is based on the student's confirmation, not an inferred backend identifier.

## Prompts from this conversation

The requests below are academic reformulations of the original messages, not a verbatim transcript. The instructor's brief and the model confirmation remain unchanged. The exact original inputs required by the assignment are preserved in [Original-prompts.md](evidence/Original-prompts.md).

### Prompt 1: question about the attached presentation

```text
Проанализируйте приложенную презентацию и определите требования к заданию SIS 2. Укажите цель работы, перечень обязательных сценариев автоматизированного тестирования, требования к структуре проекта, критерии оценивания и состав материалов для сдачи.
```

### Prompt 2: supplied assignment brief

```text
SIS 2 \
Test Automation with Playwright \
**DEADLINE - Oct 23**\
**LINK to Site to be tested&#xA0;**

[**https://practicesoftwaretesting.com/**](https://practicesoftwaretesting.com/)



1. At least 5 AT suits mentioned in the Pres - use any language you want with the Playwright framework. 
2.  Description.md - file: explain what you want to do 
   1. List of TCs to be automated 
3. [Prompt.md](http://prompt.md) file save exactly the prompt you used for the AI tool; mark exactly which tool you gonna use, like Claude Opus 5 Max efforts, etc 
4. [Review.md](http://review.md): explain what the AI results were about, how you reviewed and modified them, and justify your decisions 
5. Screenshots - AI response, Run results or whatever you think matters 
6. Link to public GitHub repository. 
7. Google Forms link:\
   \
   [**https://docs.google.com/forms/d/e/1FAIpQLSeG3uxaPlfoz9ECk9a46oP2qo4d-mm9g5LjeTKrUIpSRMDnxw/viewform?usp=publish-editor**](https://docs.google.com/forms/d/e/1FAIpQLSeG3uxaPlfoz9ECk9a46oP2qo4d-mm9g5LjeTKrUIpSRMDnxw/viewform?usp=publish-editor)
```

### Prompt 3: workflow question

```text
На основании представленных требований опишите последовательность выполнения задания SIS 2 с использованием Playwright. Обоснуйте выбор языка программирования и структуры проекта, определите порядок разработки тест-кейсов, реализации автотестов, проверки результатов и подготовки сопроводительной документации.
```

### Prompt 4: project directory

```text
Создайте в текущем рабочем каталоге отдельную директорию SIS_2_Playwright для размещения исходного кода, тестовых данных, документации и результатов выполнения задания SIS 2.
```

### Prompt 5: implementation

```text
Реализуйте задание SIS 2 в директории SIS_2_Playwright в соответствии с требованиями презентации и предоставленного задания. Разработайте на TypeScript с использованием Playwright пять наборов тестов: регистрация, вход в систему, покупка товара, сравнение двух товаров и сброс пароля. Примените Page Object Model, пользовательские fixtures и генерацию уникальных тестовых данных. Обеспечьте независимость тестов, возможность параллельного выполнения и содержательные проверки ожидаемых результатов. Подготовьте Description.md, Prompt.md, Review.md и README.md. Выполните тесты на указанном демонстрационном сайте, проанализируйте обнаруженные ошибки и сохраните результаты запусков и скриншоты. Зафиксируйте принятые решения, ограничения и фактически внесённые исправления.
```

### Prompt 6: model and effort clarification

The assistant asked: `Для обязательного Prompt.md: какое точное название модели и режим усилий отображаются у вас в этом чате? Я не могу достоверно прочитать их из приложения; скопируйте название из переключателя модели.`

The student's exact answer:

```text
gpt 6.1 sol легкое
```

## Follow-up prompts

If more prompts are used, append their exact text and identify the AI tool/model used. Keep review and explanations in Review.md. Academic reformulations should remain clearly distinguished from prompts actually submitted to the AI tool.
