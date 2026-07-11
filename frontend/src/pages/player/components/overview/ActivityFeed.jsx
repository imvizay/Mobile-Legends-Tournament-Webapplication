import {
  HiOutlineCheckCircle,
  HiOutlineUserPlus,
  HiOutlineCurrencyRupee,
} from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

const activities = [
  {
    id: 1,
    icon: HiOutlineCurrencyRupee,
    title: "Entry Fee Paid",
    description: "₹500 deposited into wallet",
    time: "2m ago",
    color: "#22c55e",
  },
  {
    id: 2,
    icon: HiOutlineUserPlus,
    title: "Player Joined",
    description: "Rahul Verma joined your team",
    time: "18m ago",
    color: "#3b82f6",
  },
  {
    id: 3,
    icon: HiOutlineCheckCircle,
    title: "Registration Approved",
    description: "Tournament registration verified",
    time: "1h ago",
    color: "#c8b07a",
  },
  {
    id: 4,
    icon: HiOutlineCurrencyRupee,
    title: "Prize Credited",
    description: "₹2,500 added to wallet",
    time: "Yesterday",
    color: "#8b5cf6",
  },
];

const ActivityFeed = () => {
  return (
    <div
      className="rounded-3xl border overflow-hidden"
      style={{
        background: "var(--surface-base)",
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-sm)",
        height: "430px",
      }}
    >
      {/* Header */}

      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)" }}
          >
            Activity Feed
          </p>

          <h2
            className="mt-1 text-lg font-semibold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "Google Sans",
            }}
          >
            Recent Activity
          </h2>
        </div>

        <button
          className="flex items-center gap-1 text-xs font-medium"
          style={{
            color: "var(--accent-gold)",
          }}
        >
          View All

          <FiArrowRight />
        </button>
      </div>

      {/* Timeline */}

      <div className="h-[345px] overflow-y-auto px-5 py-3 sidebar-scrollbar">

        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="relative flex gap-3 py-3"
            >
              {/* Timeline */}

              <div className="relative flex flex-col items-center">

                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    background: `${activity.color}15`,
                  }}
                >
                  <Icon
                    size={15}
                    style={{
                      color: activity.color,
                    }}
                  />
                </div>

                {activity.id !== activities.length && (
                  <div
                    className="mt-2 h-full w-px"
                    style={{
                      background: "var(--border-default)",
                    }}
                  />
                )}
              </div>

              {/* Content */}

              <div className="flex-1 border-b pb-4"
                style={{
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex items-center justify-between">

                  <h3
                    className="text-sm font-medium"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {activity.title}
                  </h3>

                  <span
                    className="text-[11px]"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {activity.time}
                  </span>

                </div>

                <p
                  className="mt-1 text-xs leading-5"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  {activity.description}
                </p>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;