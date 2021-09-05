type NavRoute = {
  component: React.FC<any>;
  path: string;
  _protected?: boolean;
  unprotected?: boolean;
  pageTitle: string;
  redirect: string;
  onDrawer?: boolean;
};

export type { NavRoute };
