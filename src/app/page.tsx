import Map from "./components/Map";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">EquiDobbies</h1>
      <h2 className="text-2xl mb-4">Find your garden centre</h2>
      <Map />
    </main>
  );
}
