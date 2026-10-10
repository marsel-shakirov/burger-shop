const TEST_USERS = [
  { label: 'User Dinar', email: 'webapi.user.test@gmail.com', password: 'Webapi753!' },
  { label: 'User Mars', email: 'webapi.user.test@yandex.ru', password: 'Webapi357!' },
];

const setField = (form: HTMLFormElement, name: string, value: string) => {
  const field = form.elements.namedItem(name);

  if (field instanceof HTMLInputElement) {
    field.value = value;
  }
};

export const TestUserButtons = () => (
  <div className="flex gap-3">
    {TEST_USERS.map((user) => (
      <button
        key={user.email}
        type="button"
        className="cursor-pointer rounded-md bg-green-700 p-1.5 text-white hover:opacity-85"
        onClick={(event) => {
          const { form } = event.currentTarget;
          if (!form) return;

          setField(form, 'email', user.email);
          setField(form, 'password', user.password);
        }}
      >
        {user.label}
      </button>
    ))}
  </div>
);
