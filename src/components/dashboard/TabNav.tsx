interface Props {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const TabNav = ({ tabs, activeTab, onTabChange }: Props) => (
  <nav className="glass-panel border-b border-border/50 px-4 flex gap-1 h-12 items-center overflow-x-auto">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`relative px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
          activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {tab}
        {activeTab === tab && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" style={{ boxShadow: '0 -2px 8px hsla(263,70%,58%,0.4)' }} />
        )}
      </button>
    ))}
  </nav>
);

export default TabNav;
