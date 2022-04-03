import * as React from "react";

export const TabActionsContext = React.createContext<React.Dispatch<
  React.SetStateAction<React.ReactNode>
> | null>(null);
