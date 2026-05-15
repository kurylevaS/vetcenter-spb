'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/shared/ui/Button/Button';

export default function LeadsLoginGate() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/leads/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Ошибка авторизации');
        return;
      }
      router.refresh();
    } catch {
      setError('Сеть недоступна. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border border-neutral-200">
      <h1 className="text-2xl font-bold text-cBlack mb-2">Просмотр заявки</h1>
      <p className="text-cBlack/70 mb-6 text-[1.4rem] md:text-[1.6rem]">
        Введите код доступа, чтобы открыть содержимое заявки.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Код доступа"
          className="w-full px-5 py-4 rounded-2xl border-2 border-cGreen/30 focus:border-cGreen focus:outline-none text-[1.6rem]"
        />
        {error ? (
          <p className="text-red-600 text-[1.4rem]" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          theme="green"
          size="xl"
          rounded="full"
          disabled={loading || !code.trim()}
          isLoading={loading}
          className="w-full">
          Войти
        </Button>
      </form>
    </div>
  );
}
