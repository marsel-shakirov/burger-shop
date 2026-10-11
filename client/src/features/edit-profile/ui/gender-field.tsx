import { type Gender, GENDER_LABEL, GENDERS } from '@/entities/profile';

const options = [
  ...GENDERS.map((gender) => ({ value: gender, label: GENDER_LABEL[gender] })),
  { value: '', label: 'Не указывать' },
];

interface GenderFieldProps {
  gender: Gender | null;
  invalid: boolean;
}

export const GenderField = ({ gender, invalid }: GenderFieldProps) => {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 font-bold">Пол</legend>

      <div className="flex flex-wrap gap-2">
        {options.map(({ value, label }) => (
          <label key={value} className="flex-auto">
            <input
              type="radio"
              name="gender"
              value={value}
              defaultChecked={(gender ?? '') === value}
              aria-invalid={invalid ? true : undefined}
              className="peer sr-only"
            />
            <span className="flex h-12 cursor-pointer items-center justify-center rounded-md border border-stone-400 peer-checked-orange bg-white px-2 text-sm font-bold whitespace-nowrap text-stone-600 peer-focus-ring transition-colors duration-150 peer-checked:border-transparent peer-aria-invalid:border-red-600 peer-not-checked:hover:border-stone-600 sm:text-base">
              {label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
