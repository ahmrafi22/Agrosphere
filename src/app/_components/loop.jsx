import CurvedLoop from "./curved-loop"
export function Loop() {
  return (
        <section id="community" className="h-[60vh] w-full bg-white flex items-center justify-center py-4">
          <CurvedLoop
            marqueeText="Plan 🌱 Plant 🌾 Grow 🚜 Manage 🌻 Farming 👨‍🌾 Community 🤝 Harvest 🌽 Profit 💰 Cultivate 💚 "
            speed={2}
            curveAmount={220}
            direction="left"
            interactive={true}
            className="fill-black "
          />
        </section>
  )
}


