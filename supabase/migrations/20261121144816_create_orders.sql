CREATE TABLE public.orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
      idempotency_key uuid NOT NULL,
      status text NOT NULL DEFAULT 'new',
      customer_name text NOT NULL CHECK (char_length(btrim(customer_name)) BETWEEN 1 AND
      100),
      customer_phone text NOT NULL CHECK (char_length(btrim(customer_phone)) BETWEEN 1
      AND 32),
      customer_comment text CHECK (char_length(customer_comment) <= 500),
      total_price integer NOT NULL CHECK (total_price >= 0),
      created_at timestamptz NOT NULL DEFAULT now(),

      CONSTRAINT orders_status_check
          CHECK (status IN ('new', 'accepted', 'ready', 'completed', 'cancelled')),
      CONSTRAINT orders_user_idempotency_key_unique
          UNIQUE (user_id, idempotency_key)
  );

CREATE INDEX orders_user_history_idx
    ON public.orders (user_id, created_at DESC, id DESC);

CREATE TABLE public.order_items (
      order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
      line_number integer NOT NULL CHECK (line_number > 0),
      product_id integer REFERENCES public.products(id) ON DELETE SET NULL,
      product_name text NOT NULL CHECK (btrim(product_name) <> ''),
      unit_price integer NOT NULL CHECK (unit_price >= 0),
      quantity smallint NOT NULL CHECK (quantity BETWEEN 1 AND 50),

      PRIMARY KEY (order_id, line_number)
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.orders, public.order_items FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.orders_order_number_seq FROM anon, authenticated;
