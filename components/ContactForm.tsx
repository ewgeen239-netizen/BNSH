'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { projectTypes } from '@/lib/content';
import { validateName, validateContact, validateContactForm } from '@/lib/validation';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'loading' | 'success' | 'error';
type FieldErrors = { name?: string; contact?: string };

const inputBase =
  'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-faint transition focus:bg-white/[0.05] focus:outline-none focus:ring-2';
const inputOk = 'border-white/10 focus:border-gold/40 focus:ring-gold/20';
const inputBad = 'border-red-500/40 focus:border-red-500/50 focus:ring-red-500/20';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  function fieldClass(field: keyof FieldErrors) {
    return cn(inputBase, errors[field] ? inputBad : inputOk);
  }

  // Validate a single field on blur.
  function onBlurName(e: React.FocusEvent<HTMLInputElement>) {
    setErrors((prev) => ({ ...prev, name: validateName(e.target.value) ?? undefined }));
  }
  function onBlurContact(e: React.FocusEvent<HTMLInputElement>) {
    setErrors((prev) => ({ ...prev, contact: validateContact(e.target.value) ?? undefined }));
  }
  // Clear a field error as the user corrects it.
  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Honeypot: bots fill hidden fields.
    if (data.company) {
      setStatus('success');
      form.reset();
      return;
    }

    // Block anything that isn't real, reachable contact data.
    const { valid, errors: fieldErrors } = validateContactForm(data);
    if (!valid) {
      setErrors(fieldErrors);
      setStatus('idle');
      const firstBad = fieldErrors.name ? 'name' : 'contact';
      form.querySelector<HTMLInputElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) {
          setErrors(body.errors);
          setStatus('idle');
          return;
        }
        throw new Error(body.error ?? 'Не удалось отправить заявку');
      }

      setStatus('success');
      setErrors({});
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Что-то пошло не так');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/12 text-gold-soft">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-platinum">Заявка отправлена</h3>
        <p className="mt-2 max-w-sm text-sm text-silver/70">
          Спасибо! Я свяжусь с вами в ближайшее время и предложу лучший формат под задачу.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 rounded-full border border-white/12 px-5 py-2.5 text-sm text-platinum transition hover:border-gold/40 focus-ring"
        >
          Отправить ещё одну
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-glass sm:p-8"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Имя" required error={errors.name}>
          <input
            id="name"
            name="name"
            required
            maxLength={60}
            placeholder="Как к вам обращаться"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-err' : undefined}
            className={fieldClass('name')}
            onBlur={onBlurName}
            onChange={() => clearError('name')}
          />
        </Field>

        <Field id="contact" label="Контакт" required error={errors.contact}>
          <input
            id="contact"
            name="contact"
            required
            maxLength={120}
            placeholder="Email, телефон или @telegram"
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? 'contact-err' : 'contact-hint'}
            className={fieldClass('contact')}
            onBlur={onBlurContact}
            onChange={() => clearError('contact')}
          />
        </Field>
      </div>

      {!errors.contact && (
        <p id="contact-hint" className="mt-1.5 text-xs text-faint">
          Например: name@mail.com · +48 600 000 000 · @username
        </p>
      )}

      <div className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="type" className="text-xs font-medium text-silver">
          Тип проекта
        </label>
        <select
          id="type"
          name="type"
          defaultValue=""
          className={cn(inputBase, inputOk, 'appearance-none')}
        >
          <option value="" disabled className="bg-ink-850">
            Выберите формат
          </option>
          {projectTypes.map((t) => (
            <option key={t} value={t} className="bg-ink-850">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-silver">
          Коротко о проекте
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Что нужно, для кого, есть ли примеры и сроки"
          className={cn(inputBase, inputOk, 'resize-none')}
        />
      </div>

      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {error || 'Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.'}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-platinum px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-white focus-ring disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Отправляю…
          </>
        ) : (
          <>
            Отправить заявку
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-faint">
        Нажимая «Отправить», вы соглашаетесь на обработку данных для ответа на заявку.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-silver">
        {label} {required && <span className="text-gold-soft">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            id={`${id}-err`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
