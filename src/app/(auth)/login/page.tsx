'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
import styles from '@/css/login.module.css';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Некоректна пошта' }),
  password: z.string().min(1, 'Пароль обов’язковий'),
});

export default function Login() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error('Невірний логін або пароль');
    } else {
      redirect('/');
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.mainHeading}>
          Вітаємо у внутрішній системі студентської ради <br /> ІТ СТЕП
          Університету!
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
                        placeholder="Введіть логін.."
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
                        placeholder="Введіть пароль..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>

            <div className="flex justify-center">
              <Button type="submit" className={styles.submitButton}>
                Увійти
              </Button>
            </div>
            <div className={styles.authSwitch}>
              <span>Ще не маєте акаунту?</span>
              <Link href="/register" className={styles.authLink}>
                Зареєструватися
              </Link>
            </div>
          </form>
        </Card>

        <div className={styles.socialContainer}>
          <Button
            variant="secondary"
            onClick={() => signIn('github', { callbackUrl: '/' })}
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
            onClick={() => signIn('google', { callbackUrl: '/' })}
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
