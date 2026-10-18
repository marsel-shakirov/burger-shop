import { useState } from 'react';

import { copyText } from '../lib/copy-text';

type CopyStatus = 'idle' | 'copied' | 'failed';

const COPY_LABEL: Record<CopyStatus, string> = {
  idle: 'Скопировать код',
  copied: 'Код скопирован',
  failed: 'Скопируйте вручную',
};

interface CopyPromoCodeButtonProps {
  code: string;
}

export const CopyPromoCodeButton = ({ code }: CopyPromoCodeButtonProps) => {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const copyCode = async () => {
    setStatus((await copyText(code)) ? 'copied' : 'failed');
  };

  return (
    <button
      type="button"
      onClick={copyCode}
      data-copied={status === 'copied' || undefined}
      className="rounded-full bg-stone-900 px-3.5 py-2.5 text-sm leading-none font-bold whitespace-nowrap text-paper focus-ring transition-colors hover:bg-stone-700 data-copied:bg-lime-800"
    >
      {COPY_LABEL[status]}
    </button>
  );
};
