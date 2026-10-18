interface PromoCodeProps {
  code: string;
}

export const PromoCode = ({ code }: PromoCodeProps) => {
  return (
    <span className="rounded-md border-[1.5px] border-current px-2 py-0.5 text-[0.9375rem] font-extrabold tracking-[0.08em] select-all">
      {code}
    </span>
  );
};
