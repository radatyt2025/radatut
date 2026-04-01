'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import styles from '@/css/register.module.css';
import { registerUser } from '@/lib/action/register-user';

const registerFormSchema = z
  .object({
    email: z.string().email({ message: 'Некоректна пошта' }),
    password: z.string().min(8, 'Пароль занадто короткий'),
    confirmPassword: z.string().min(8, 'Пароль занадто короткий'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export default function Register() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(data: z.infer<typeof registerFormSchema>) {
    const { email, password } = data;
    await registerUser({ email, password });
    await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/',
    });
    toast.success('Успішно зареєстровано!');
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.mainHeading}>
          Вітаємо у внутрішній системі студентської ради <br /> ІТ СТЕП Університету!
        </h1>

        <p className={styles.subHeading}>
          Ця система для роботи лише членів студентської ради :&#41;
        </p>

        <Card className={styles.formCard}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FieldGroup className={styles.fieldGroup}>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className={styles.fieldLabel}>
                        Логін
                      </FieldLabel>
                      <Input
                        {...field}
                        className={styles.inputField}
                        placeholder="Введіть пошту.."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className={styles.fieldLabel}>
                        Пароль
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        className={styles.inputField}
                        placeholder="Введіть пароль.."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className={styles.fieldLabel}>
                        Повторіть Пароль
                      </FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        className={styles.inputField}
                        placeholder="Повторіть Пароль.."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>

            <div className="flex justify-center mt-6">
              <Button type="submit" className={styles.submitButton}>
                Зареєструватись
              </Button>
            </div>
          </form>
        </Card>

        <div className={styles.socialContainer}>
          <Button
            variant="secondary"
            onClick={() =>
              signIn('github', { callbackUrl: '/', redirect: true })
            }
            className={styles.socialButton}>
            <Image
              width={24}
              height={24}
              src="/images/git-hub.png"
              alt="github"
            />
            GitHub
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              signIn('google', { callbackUrl: '/', redirect: true })
            }
            className={styles.socialButton}>
            <Image
              width={24}
              height={24}
              src="/images/google.svg"
              alt="google"
            />
            Google
          </Button>
        </div>
      </div>
    </section>
  );
}
