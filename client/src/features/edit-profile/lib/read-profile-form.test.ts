import { describe, expect, it } from 'vitest';

import { readProfileForm } from './read-profile-form';

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([name, value]) => formData.append(name, value));

  return formData;
};

const personalFields = {
  name: 'Марсель',
  birthDay: '7',
  birthMonth: '3',
  birthYear: '1990',
  gender: 'male',
};

describe('readProfileForm: раздел phone', () => {
  it('возвращает только телефон без пробелов по краям', () => {
    const formData = createFormData({ ...personalFields, phone: '  +7 999 123-45-67  ' });

    expect(readProfileForm('phone', formData)).toEqual({
      ok: true,
      update: { phone: '+7 999 123-45-67' },
    });
  });

  it('возвращает null для пустого телефона', () => {
    expect(readProfileForm('phone', createFormData({ phone: '   ' }))).toEqual({
      ok: true,
      update: { phone: null },
    });
  });

  it('не проверяет дату рождения', () => {
    const formData = createFormData({ phone: '+7 999', birthDay: '31', birthMonth: '4' });

    expect(readProfileForm('phone', formData).ok).toBe(true);
  });
});

describe('readProfileForm: раздел personal', () => {
  it('собирает имя, дату рождения и пол', () => {
    expect(readProfileForm('personal', createFormData(personalFields))).toEqual({
      ok: true,
      update: { name: 'Марсель', birthDate: '1990-03-07', gender: 'male' },
    });
  });

  it('не включает телефон', () => {
    const formData = createFormData({ ...personalFields, phone: '+7 999' });

    expect(readProfileForm('personal', formData)).toEqual({
      ok: true,
      update: { name: 'Марсель', birthDate: '1990-03-07', gender: 'male' },
    });
  });

  it('обрезает пробелы в имени', () => {
    const formData = createFormData({ ...personalFields, name: '  Марсель  ' });

    expect(readProfileForm('personal', formData)).toMatchObject({
      ok: true,
      update: { name: 'Марсель' },
    });
  });

  it('возвращает null для пустого имени', () => {
    const formData = createFormData({ ...personalFields, name: '   ' });

    expect(readProfileForm('personal', formData)).toMatchObject({
      ok: true,
      update: { name: null },
    });
  });

  it('возвращает null для незаполненной даты рождения', () => {
    const formData = createFormData({
      ...personalFields,
      birthDay: '',
      birthMonth: '',
      birthYear: '',
    });

    expect(readProfileForm('personal', formData)).toMatchObject({
      ok: true,
      update: { birthDate: null },
    });
  });

  it('возвращает ошибку поля birthDate для некорректной даты', () => {
    const formData = createFormData({ ...personalFields, birthDay: '31', birthMonth: '4' });

    expect(readProfileForm('personal', formData)).toEqual({
      ok: false,
      error: { message: 'В апреле 30 дней. Проверьте день', field: 'birthDate' },
    });
  });

  it.each(['', 'other'])('возвращает null для пола %j', (gender) => {
    const formData = createFormData({ ...personalFields, gender });

    expect(readProfileForm('personal', formData)).toMatchObject({
      ok: true,
      update: { gender: null },
    });
  });

  it('считает отсутствующие поля пустыми', () => {
    expect(readProfileForm('personal', new FormData())).toEqual({
      ok: true,
      update: { name: null, birthDate: null, gender: null },
    });
  });
});
