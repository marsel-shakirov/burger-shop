export interface PageMetaProps {
  title: string;
  noindex?: boolean;
}

export const PageMeta = ({ title, noindex = false }: PageMetaProps) => {
  return (
    <>
      <title>{`${title} — BurgerShop`}</title>
      {noindex && <meta name="robots" content="noindex" />}
    </>
  );
};
