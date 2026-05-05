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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import styles from '@/css/team-members.module.css';
import { addTeamMember } from '@/lib/action/add-team-member';

const TeamMemberFormSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['USER', 'ADMIN']),
  team: z.enum(['Медіа', 'Управління']),
  imageFile: z.instanceof(File),

  telegramLink: z.string().optional(),
  instagramLink: z.string().optional(),
  description: z.string().optional(),
});

export const TeamMembersForm: React.FC = () => {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof TeamMemberFormSchema>>({
    resolver: zodResolver(TeamMemberFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'USER',
      team: 'Медіа',
      telegramLink: '',
      instagramLink: '',
      description: '',
      imageFile: undefined,
    },
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className={styles.fieldLabel}>Пошта</FieldLabel>
                  <Input
                    {...field}
                    className={styles.inputField}
                    placeholder="Пошта"
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
                  <FieldLabel className={styles.fieldLabel}>Пароль</FieldLabel>
                  <Input
                    {...field}
                    className={styles.inputField}
                    placeholder="Пароль"
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={styles.selectTrigger}>
                      <SelectValue placeholder="Оберіть роль" />
                    </SelectTrigger>
                    <SelectContent className={styles.selectContent}>
                      <SelectItem value="USER" className={styles.selectItem}>
                        Користувач
                      </SelectItem>
                      <SelectItem value="ADMIN" className={styles.selectItem}>
                        Адміністратор
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    className={styles.fileInput}
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
                    <div className={styles.imagePreviewContainer}>
                      <img
                        src={previewUrl}
                        alt="Image Preview"
                        className={styles.previewImage}
                      />
                    </div>
                  )}

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="team"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className={styles.fieldLabel}>Команда</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={styles.selectTrigger}>
                      <SelectValue placeholder="Оберіть команду" />
                    </SelectTrigger>
                    <SelectContent className={styles.selectContent}>
                      <SelectItem value="Медіа" className={styles.selectItem}>
                        Медіа
                      </SelectItem>
                      <SelectItem
                        value="Управління"
                        className={styles.selectItem}>
                        Управління
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="telegramLink"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className={styles.fieldLabel}>
                    Telegram
                  </FieldLabel>
                  <Input
                    {...field}
                    className={styles.inputField}
                    placeholder="telegram username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="instagramLink"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className={styles.fieldLabel}>
                    Instagram
                  </FieldLabel>
                  <Input
                    {...field}
                    className={styles.inputField}
                    placeholder="instagram username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className={styles.fieldLabel}>Опис</FieldLabel>
                  <textarea
                    {...field}
                    className={styles.textareaField}
                    placeholder="Опис учасника"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>

        <div className={styles.submitContainer}>
          <Button type="submit" className={styles.submitButton}>
            Додати
          </Button>
        </div>
      </form>
    </Card>
  );
};
