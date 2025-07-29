import AdminOnlyLayout from "@/components/AdminOnlyLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminOnlyLayout>{children}</AdminOnlyLayout>;
}
