import CarnetShell from "@/components/carnet/CarnetShell";

export default function CarnetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CarnetShell>{children}</CarnetShell>;
}
