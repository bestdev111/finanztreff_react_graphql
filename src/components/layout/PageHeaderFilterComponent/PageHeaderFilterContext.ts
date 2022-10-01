import React from "react";

export type PageHeaderFilterContextValue = {
    close: () => void;
    open: () => void;
    state: any;
    setState: (state: any) => void;
}

const PageHeaderFilterContext = React.createContext<PageHeaderFilterContextValue | null>(null);

export default PageHeaderFilterContext;
