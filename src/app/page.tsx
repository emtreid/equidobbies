import Map from "./components/Map";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">EquiDobbies</h1>
      <h2 className="text-2xl mb-4">Find your garden centre</h2>
      <p className="mb-8 text-center max-w-xl">Enter the locations of you and some friends to find your most equidistant Dobbies!</p>
      <Map />
    </main>
  );
}
