import AuthProvider from "@/components/AuthProvider";

export const metadata = { title: "Admin | OMKAR CREATIONS" };

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
