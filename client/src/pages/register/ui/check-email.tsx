interface CheckEmailProps {
  email: string;
  onChangeEmail: () => void;
}

export const CheckEmail = ({ email, onChangeEmail }: CheckEmailProps) => {
  return (
    <div className="flex flex-col gap-y-5">
      <h1 ref={(node) => node?.focus()} tabIndex={-1} className="text-2xl outline-none sm:text-3xl">
        Проверьте почту
      </h1>

      <p className="text-base/relaxed">
        Мы отправили письмо на <strong className="break-all">{email}</strong>. Перейдите по ссылке
        из письма, чтобы подтвердить email и войти в профиль.
      </p>

      <div className="flex flex-col gap-y-3 border-t border-dashed border-stone-300 pt-5">
        <p className="text-sm text-stone-500">
          Письма нет? Загляните в «Спам» или проверьте, нет ли ошибки в адресе.
        </p>
        <button
          type="button"
          onClick={onChangeEmail}
          className="h-12 w-full cursor-pointer rounded-md border border-stone-400 bg-white font-bold text-stone-900 focus-ring transition-colors duration-150 hover:border-stone-900"
        >
          Изменить email
        </button>
      </div>
    </div>
  );
};
