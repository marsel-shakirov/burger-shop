import { useId } from 'react';

import { MONTHS_GENITIVE } from '@/entities/profile';
import { ArrowIcon } from '@/shared/ui/icon';
import { TextInput } from '@/shared/ui/text-input';

import { splitBirthDate } from '../lib/split-birth-date';

interface BirthDateFieldProps {
  birthDate: string | null;
  invalid: boolean;
}

export const BirthDateField = ({ birthDate, invalid }: BirthDateFieldProps) => {
  const dayId = useId();
  const monthId = useId();
  const yearId = useId();
  const { day, month, year } = splitBirthDate(birthDate);
  const ariaInvalid = invalid ? true : undefined;

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 font-bold">Дата рождения</legend>

      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_5.5rem] gap-2">
        <label htmlFor={dayId} className="sr-only">
          День
        </label>
        <TextInput
          id={dayId}
          name="birthDay"
          defaultValue={day}
          inputMode="numeric"
          autoComplete="bday-day"
          maxLength={2}
          placeholder="день"
          aria-invalid={ariaInvalid}
          className="tabular-nums"
        />

        <label htmlFor={monthId} className="sr-only">
          Месяц
        </label>
        <div className="relative">
          <select
            id={monthId}
            name="birthMonth"
            defaultValue={month}
            autoComplete="bday-month"
            aria-invalid={ariaInvalid}
            className="h-12 w-full cursor-pointer appearance-none rounded-md border border-stone-400 bg-white pr-9 pl-4 text-base text-stone-900 focus-ring transition-colors duration-150 hover:border-stone-600 has-[option[value='']:checked]:text-stone-400 aria-invalid:border-red-600 [&>option]:text-stone-900"
          >
            <option value="">месяц</option>
            {MONTHS_GENITIVE.map((monthName, index) => (
              <option key={monthName} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
          <ArrowIcon className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2 -rotate-90 text-stone-500" />
        </div>

        <label htmlFor={yearId} className="sr-only">
          Год
        </label>
        <TextInput
          id={yearId}
          name="birthYear"
          defaultValue={year}
          inputMode="numeric"
          autoComplete="bday-year"
          maxLength={4}
          placeholder="год"
          aria-invalid={ariaInvalid}
          className="tabular-nums"
        />
      </div>
    </fieldset>
  );
};
