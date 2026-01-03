import Keyboard from "../components/Keyboard";
function GameScreen() {
  return (
    <section className="bg-[#fbf6ea] relative min-h-screen flex flex-col items-center justify-center">
      <div className ="w-full max-w-lg">
        <div className ="mb-8 grid grid-cols-5 gap-1.5 w-fit mx-auto">
{Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-14 h-14 border-2 border-[#3a3a3c] rounded" />
          ))}
        </div>
      </div>
      <Keyboard />
    </section>
  );
}
export default GameScreen;
