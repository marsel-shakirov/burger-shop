export interface PageMetaProps {
  title: string;
  noindex?: boolean;
}

// React 19 поднимает <title> и <meta> в <head>
export const PageMeta = ({ title, noindex = false }: PageMetaProps) => {
  return (
    <>
      <title>{`${title} — BurgerShop`}</title>
      {noindex && <meta name="robots" content="noindex" />}
    </>
  );
};
