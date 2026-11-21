import { useId } from 'react';

import type { Product } from '@/entities/product';
import { formatPrice } from '@/shared/lib';
import { DotLeaderRow } from '@/shared/ui/dot-leader-row';
import { Receipt } from '@/shared/ui/receipt';

export interface CheckoutLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export const CheckoutSummary = ({ lines }: { lines: CheckoutLine[] }) => {
  const titleId = useId();

  const totalPrice = lines.reduce((sum, { lineTotal }) => sum + lineTotal, 0);

  return (
    <section aria-labelledby={titleId} className="min-w-0">
      <Receipt.Root>
        <Receipt.Body className="pt-5 pb-7">
          <h2 id={titleId} className="text-lg font-bold">
            Состав заказа
          </h2>
          <ul role="list" className="flex flex-col gap-y-3 text-sm">
            {lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.id}>
                <DotLeaderRow
                  label={
                    <div className="min-w-0">
                      <p className="font-bold wrap-anywhere">{product.name}</p>
                      <p className="text-stone-600 tabular-nums">
                        {quantity} × {formatPrice(product.price)}
                      </p>
                    </div>
                  }
                  value={
                    <data value={lineTotal} className="shrink-0 font-bold tabular-nums">
                      {formatPrice(lineTotal)}
                    </data>
                  }
                />
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between gap-x-4 border-t border-dashed border-stone-300 pt-4">
            <span className="font-bold">Итого</span>
            <data
              value={totalPrice}
              className="font-display text-2xl font-extrabold tabular-nums sm:text-3xl"
            >
              {formatPrice(totalPrice)}
            </data>
          </div>
        </Receipt.Body>
      </Receipt.Root>
    </section>
  );
};
