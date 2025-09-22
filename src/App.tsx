import './App.css';
import {useState } from 'react';

type ChatMessage = { role: 'system' | 'user' | 'assistant', content: string};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [lintOutput, setLintOutput] = useState('');
  const [mode] = useState<'standard' | 'lint_and_tests'>('standard');

  const mockOpenaiChatCompletionsCreate = ({ model, messages }: {model: string, messages: ChatMessage[]}) => {
    if (mode === 'standard') {
      return {
        choices: [
          {
            message: {
              role: 'assistant',
              content:
                "Code Review Summary:\n- Bug: function `sum` lacks input validation and missing semicolon.\n- Suggestion: add basic type checks, use default parameters, add semicolon.\n\nSuggested actions:\n1) Run ESLint (rule: semi)\n2) Add unit test for negative numbers\n3) Consider using === for comparisons\n\nPatch suggestion:\n```js\nfunction sum(a = 0, b = 0) {\n if (typeof a !== 'number' || typeof b !== 'number') {\n throw new TypeError('Arguments must be numbers');\n }\n return a + b;\n}\n```\n\nI can run the supplied tests or lint if you want (mocked in this prototype).",
            },
          },
        ],
      };
    }

    if (mode === 'lint_and_tests') {
      return {
        choices: [
          {
            message: {
              role: 'assistant',
              content:
                "Automated Review (lint+tests requested):\n- ESLint found: missing semicolon (semi) and prefer-const not used.\n- Tests: 1 failing test (sum handles strings incorrectly).\n\nActions to reproduce:\n- Run `npm run lint` -> shows 2 errors.\n- Run `npm test` -> 1 failing test with stacktrace.\n\nSuggested fix: coerce or validate inputs and add semicolon. Example patch attached.\n\nPatch suggestion:\n```js\nfunction sum(a, b) {\n const x = Number(a);\n const y = Number(b);\n if (Number.isNaN(x) || Number.isNaN(y)) {\n throw new TypeError('Arguments must be numeric');\n }\n return x + y;\n};\n```",
            },
          },
        ],
      };
    }

    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'No mock scenario matched.',
          },
        },
      ],
    };
  };

  async function callOpenAI({ model = 'gpt-4o-mini', messages = [] } : {model: string, messages: ChatMessage[]}) {
    return mockOpenaiChatCompletionsCreate({ model, messages });
  }

  async function handleSubmit() {
    setIsLoading(true);
    setReview('');
    setLintOutput('');
    setTestOutput('');

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: `Please review the following code: \n\n${code}` },
    ];

    try {
      const completion = await callOpenAI({ model: 'gpt-4o-mini', messages });
      const msg = completion.choices[0].message;
      setReview(msg.content);
    } catch (err) {
      if (err instanceof Error) {
      setReview(`Error calling assistant: ${err.message}`);
      } else {
        setReview(`Unknown error occurred: ${err}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function runMockEslint() {
    const results: { rule: string; message: string }[] = [];

    const missingSemicolon = /\n\}/.test(code) && !/;\s*$/.test(code.trim());
    if (missingSemicolon) {
      results.push({ rule: 'semi', message: 'Missing semicolon.' });
    }
    if (/\bvar\b/.test(code) || /\blet\b/.test(code)) {
      results.push({
        rule: 'prefer-const',
        message: 'Prefer const when variable is not reassigned.',
      });
    }

    if (results.length === 0) {
      setLintOutput('ESLint: no problems found (mock)');
    } else {
      setLintOutput(
        'ESLint found:\n' +
          results.map((r) => `- ${r.rule}: ${r.message}`).join('\n')
      );
    }
  }

  function runMockTests() {
    if (/return\s+a\s*\+\s*b/.test(code)) {
      setTestOutput('Tests: 2 passed, 0 failed (mock)');
    } else if (/Number\(a\)/.test(code) || /Number\(b\)/.test(code)) {
      setTestOutput(
        'Tests: 1 passed, 1 failed - strings to numbers case failing (mock)'
      );
    } else {
      setTestOutput('Tests: 0 passed, 2 failed (mock)');
    }
  }

  return (
    <>
      <div className="chatArea">
        <h1>Code Review</h1>
        <div className="reviewBox">
          <label htmlFor="review" className="reviewLabel">
            Код для ревью
          </label>
          <textarea
            name="review"
            id="review"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>
        <div className="action-buttons">
          <button className="send" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Загрузка...' : 'Отправить'}
          </button>
          <button className="runLinter" onClick={runMockEslint}>
            Запустить ESLint (mock)
          </button>
          <button className="runTests" onClick={runMockTests}>
            Запустить Тесты (mock)
          </button>
        </div>
        <div className="assistantResponse">
          <div className="answer">
            <label htmlFor="answer" className="answerLabel">
              Ответ ассистента
            </label>
            <textarea
              name="answer"
              id="answer"
              value={review}
              readOnly
            ></textarea>
          </div>
          <div className="additional-tests">
            <div className="es-mock-box">
              <label htmlFor="es-mock" className="es-mock-label">
                ESLint (mock)
              </label>
              <textarea
                name="es-mock"
                id="es-mock"
                value={lintOutput}
                readOnly
              ></textarea>
            </div>
            <div className="tests-mock-box">
              <label htmlFor="test-mock" className="test-mock-label">
                Тесты (mock)
              </label>
              <textarea
                name="test-mock"
                id="test-mock"
                value={testOutput}
                readOnly
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
