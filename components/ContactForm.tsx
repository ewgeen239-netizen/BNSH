'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { validateName, validateContact, validateContactForm } from '@/lib/validation';
import { useLang, useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'loading' | 'success' | 'error';
type FieldErrors = { name?: string; contact?: string }; // values are error codes

const inputBase =
  'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-platinum placeholder:text-faint transition focus:bg-white/[0.05] focus:outline-none focus:ring-2';
const inputOk = 'border-white/10 focus:border-gold/40 focus:ring-gold/20';
const inputBad = 'border-red-500/40 focus:border-red-500/50 focus:ring-red-500/20';

export function ContactForm() {
  const { locale } = useLang();
  const t = useT();
  const f = t.contact.form;
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const msg = (code?: string) => (code ? t.errors[code] ?? code : undefined);

  function fieldClass(field: keyof FieldErrors) {
    return cn(inputBase, errors[field] ? inputBad : inputOk);
  }

  function onBlurName(e: React.FocusEvent<HTMLInputElement>) {
    setErrors((prev) => ({ ...prev, name: validateName(e.target.value) ?? undefined }));
  }
  function onBlurContact(e: React.FocusEvent<HTMLInputElement>) {
    setErrors((prev) => ({ ...prev, contact: validateContact(e.target.value) ?? undefined }));
  }
  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    if (data.company) {
      setStatus('success');
      form.reset();
      return;
    }

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
        // The route answers in Russian for the logs; the visitor gets the
        // localized message, which already points at the direct Telegram link.
        throw new Error(f.errorGeneric);
      }

      setStatus('success');
      setErrors({});
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : f.errorGeneric);
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
        <h3 className="mt-5 text-xl font-semibold text-platinum">{f.successTitle}</h3>
        <p className="mt-2 max-w-sm text-sm text-silver/70">{f.successText}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 rounded-full border border-white/12 px-5 py-2.5 text-sm text-platinum transition hover:border-gold/40 focus-ring"
        >
          {f.successAgain}
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
        <Field id="name" label={f.name} required error={msg(errors.name)}>
          <input
            id="name"
            name="name"
            required
            maxLength={60}
            placeholder={f.namePh}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-err' : undefined}
            className={fieldClass('name')}
            onBlur={onBlurName}
            onChange={() => clearError('name')}
          />
        </Field>

        <Field id="contact" label={f.contact} required error={msg(errors.contact)}>
          <input
            id="contact"
            name="contact"
            required
            maxLength={120}
            placeholder={f.contactPh}
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
          {f.contactHint}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="type" className="text-xs font-medium text-silver">
          {f.type}
        </label>
        <select
          id="type"
          name="type"
          defaultValue=""
          className={cn(inputBase, inputOk, 'appearance-none')}
        >
          <option value="" disabled className="bg-ink-850">
            {f.typePh}
          </option>
          {f.typeOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-ink-850">
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-silver">
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder={f.messagePh}
          className={cn(inputBase, inputOk, 'resize-none')}
        />
      </div>

      <input type="hidden" name="locale" value={locale} />

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
            {error || f.errorGeneric}
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
            {f.sending}
          </>
        ) : (
          <>
            {f.submit}
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-faint">{f.consent}</p>
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
