'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
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
import styles from '@/css/add-team-member.module.css';
import { addTeamMember } from '@/lib/action/add-team-member';

const TeamMemeberFormSchema = z.object({
  fullName: z.string().min(1),
  role: z.string().min(1),
  imageSrc: z.string().min(1),
});

export default function AddTeamMember() {
  const router = useRouter();

  const form = useForm<z.infer<typeof TeamMemeberFormSchema>>({
    resolver: zodResolver(TeamMemeberFormSchema),
    defaultValues: { fullName: '', role: '', imageSrc: '' },
  });

  async function onSubmit(data: z.infer<typeof TeamMemeberFormSchema>) {
    const response = await addTeamMember(data);

    if (!response.success) {
      if (response.field) {
        form.setError(response.field, { message: response.message });
      } else {
        toast.error(response.message);
      }
      return;
    }

    toast.success('Успішно додано!');
    router.push('/');
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
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className={styles.fieldLabel}>
                        Повне ім&apos;я
                      </FieldLabel>
                      <Input
                        {...field}
                        className={styles.inputField}
                        placeholder="Повне ім'я"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className={styles.fieldLabel}>
                        Роль
                      </FieldLabel>
                      <Input
                        {...field}
                        className={styles.inputField}
                        placeholder="Роль"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="imageSrc"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className={styles.fieldLabel}>
                        Зображення
                      </FieldLabel>
                      <Input
                        {...field}
                        className={styles.inputField}
                        placeholder="Зображення"
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
                Додати
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
