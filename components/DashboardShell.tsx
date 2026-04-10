import DashboardNav from "@/components/DashboardNav";

type DashboardShellProps = {
  children: React.ReactNode;
};

const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
};

export default DashboardShell;
