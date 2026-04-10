'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState, useEffect } from 'react';
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
import styles from '@/css/team-members.module.css';
import { addTeamMember } from '@/lib/action/add-team-member';

const TeamMemberFormSchema = z.object({
  fullName: z.string().min(1, 'Ім\'я є обов\'язковим'),
  role: z.string().min(1, 'Роль є обов\'язковою'),
  imageFile: z.instanceof(File, { message: 'Зображення є обов\'язковим' }),
});

export const TeamMembersForm: React.FC = () => {
  const router = useRouter();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof TeamMemberFormSchema>>({
    resolver: zodResolver(TeamMemberFormSchema),
    defaultValues: { fullName: '', role: '', imageFile: undefined },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function onSubmit(data: z.infer<typeof TeamMemberFormSchema>) {
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
    form.reset();
    setPreviewUrl(null);
    router.refresh();
  }

  return (
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
                  <FieldLabel className={styles.fieldLabel}>Роль</FieldLabel>
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
              name="imageFile"
              control={form.control}
              render={({
                field: { onChange, value: _value, ...rest },
                fieldState,
              }) => (
                <Field>
                  <FieldLabel className={styles.fieldLabel}>
                    Зображення
                  </FieldLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    className={styles.inputField}
                    {...rest}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);

                        const newPreviewUrl = URL.createObjectURL(file);
                        setPreviewUrl(newPreviewUrl);
                      }
                    }}
                  />

                  {previewUrl && (
                    <div className="mt-4 flex justify-center">
                      <img
                        width={128}
                        height={128}
                        src={previewUrl}
                        alt="Image Preview"
                        className="h-32 w-32 object-cover rounded-lg border-2 border-slate-200"
                      />
                    </div>
                  )}

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
            Додати
          </Button>
        </div>
      </form>
    </Card>
  );
};
