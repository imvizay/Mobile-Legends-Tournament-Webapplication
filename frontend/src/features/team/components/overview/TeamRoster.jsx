import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";
import PlayerRow from "../../../../features/team/components/overview/PlayerCard";

const players = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "",
    mlbbId: "811529",
    server: "2169",
    role: "Captain",
    payment: "Paid",
  },
  {
    id: 2,
    name: "Aman Patel",
    avatar: "",
    mlbbId: "932188",
    server: "2187",
    role: "Roamer",
    payment: "Pending",
  },
  {
    id: 3,
    name: "Vishal Singh",
    avatar: "",
    mlbbId: "781192",
    server: "2169",
    role: "Gold Lane",
    payment: "Paid",
  },
   {
    id: 4,
    name: "Vishal Singh",
    avatar: "",
    mlbbId: "781192",
    server: "2169",
    role: "Gold Lane",
    payment: "Paid",
  },
   {
    id: 5,
    name: "Vishal Singh",
    avatar: "",
    mlbbId: "781192",
    server: "2169",
    role: "Gold Lane",
    payment: "Paid",
  },

];

export default function TeamRoster() {
  return (
    <section
      className="rounded-3xl border overflow-hidden"
      style={{
        background: "var(--surface-base)",
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}

      <div
        className=" flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5 "
        style={{
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.18em] font-semibold"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Team Roster
          </p>

          <h2
            className="mt-1 text-lg font-semibold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "Google Sans",
            }}
          >
            5 / 7 Players Registered
          </h2>
        </div>

        <div className="flex gap-3">


          <button
            className=" flex w-full items-center justify-center  gap-2 rounded-xl border px-4 py-2.5 text-sm sm:w-auto sm:border-0 sm:p-0 "
            style={{
                color:"var(--accent-gold)",
                borderColor:"var(--border-default)"
            }}
          >
            View All

            <FiArrowRight />
          </button>

        </div>
      </div>

      {/* List */}

      <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
        {players.map((player) => (
          <PlayerRow key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}