export type SidePanelState = {
  drawerWidth: number;
  opens: boolean;
  selectedMenuNames: string;
};

export const initialSidePanelState: SidePanelState = ((): SidePanelState => {
  return {
    drawerWidth: 480,
    opens: false,
    selectedMenuNames: "",
  };
})();
