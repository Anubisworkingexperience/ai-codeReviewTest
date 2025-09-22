import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('Code Review App (mock)', () => {
  it('renders header and textarea', () => {
    render(<App />);
    expect(screen.getByText(/Code Review/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Код для ревью/i)).toBeInTheDocument();
  });

  it('submits code and shows assistant review (mock)', async () => {
    render(<App />);
    const input = screen.getByLabelText(/Код для ревью/i);
    fireEvent.change(input, { target: { value: 'function sum(a,b){return a+b}' } });

    const sendButton = screen.getByRole('button', { name: /Отправить/i });
    fireEvent.click(sendButton);

    await waitFor(() =>
      expect((screen.getByLabelText(/Ответ ассистента/i) as HTMLTextAreaElement).value)
    .toContain('Code Review Summary'));
  });

  it('runs ESLint mock and displays results', () => {
    render(<App />);
    const input = screen.getByLabelText(/Код для ревью/i);
    fireEvent.change(input, { target: { value: 'var x = 1\n}' } });

    const lintButton = screen.getByRole('button', { name: /Запустить ESLint/i });
    fireEvent.click(lintButton);

    
    expect((screen.getByLabelText(/ESLint \(mock\)/i) as HTMLTextAreaElement).value)
    .toContain('ESLint found:');
  });

  it('runs Tests mock and displays results', () => {
    render(<App />);
    const input = screen.getByLabelText(/Код для ревью/i);
    fireEvent.change(input, { target: { value: 'function sum(a,b){return a+b}' } });

    const testsButton = screen.getByRole('button', { name: /Запустить Тесты/i });
    fireEvent.click(testsButton);

    expect((screen.getByLabelText(/Тесты \(mock\)/i) as HTMLTextAreaElement).value)
    .toContain('passed');
  });
});
