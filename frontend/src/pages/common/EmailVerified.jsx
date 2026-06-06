import {
  CheckCircle2,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const EmailVerified = () => {
  return (
    <section
      className=" min-h-screen flex items-center justify-center px-2 py-2 md:px-4 md:py-4 bg-[var(--bg-canvas)]">
      <div
        className=" relative w-full max-w-2xl rounded-2xl md:rounded-[32 p-2 sm:p-5 md:p-5
        bg-[var(--surface-base)]
        border border-[var(--border-default)]
        "
        style={{
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <div
            className=" relative flex items-center justify-center w-10 h-10 md:w-15 md:h-15 rounded-full bg-[var(--bg-canvas-secondary)]
            border border-[var(--border-default)]"
            >
            <CheckCircle2      
              className="size-8 md:size-[32px] text-[var(--headline-accent)]"
            />
          </div>
        </div>

        {/* Heading */}

        <div className="text-center  mt-1 md:mt-4">
          <p
            className=" uppercase tracking-[3px] text-[10px] font-medium text-[var(--headline-accent)] ">
            EMAIL VERIFIED
          </p>

          <h1
            className=" mt-1 font-[General Sans] font-bold text-3xl sm:text-4xl text-[var(--headline-primary)] font-[CormorantGaramond]">
            Account Successfully
            <br />
            Verified
          </h1>

          <p
            className=" mt-3 max-w-xl mx-auto text-[10px] sm:text-[12px] leading-relaxed text-[var(--text-secondary)]">
            Your email address has been successfully verified.
            Your Gamix account is now active and ready to
            participate in tournaments, competitions and
            platform activities.
          </p>
        </div>

        {/* Status Card */}
        <div
          className=" mt-5 rounded-3xl overflow-hidden bg-[var(--surface-elevated)] border border-[var(--border-default)]">
          <div className="p-4">
            <p
              className=" text-xs uppercase tracking-[2px] mb-1 font-medium text-[var(--text-muted)]" >
              Account Status
            </p>

            <div className="md:space-y-1">
              <StatusItem
                icon={<Mail size={18} />}
                title="Email Verification"
              />

              <StatusItem
                icon={<CheckCircle2 size={18} />}
                title="Account Activation"
              />

              <StatusItem
                icon={<ShieldCheck size={18} />}
                title="Security Validation"
              />
            </div>
          </div>
        </div>

        {/* CTA */}

        <button
          className=" mt-2 md:mt-5 w-full h-12 md:h-14 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 hover:scale-[1.01] bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]" >
          Explore Gamix Platform
          <ArrowRight size={18} />
        </button>

        {/* Footer */}

        <div
          className=" mt-2 md:mt-3 text-center text-[10px] text-[var(--text-muted)]">
          You can now access tournaments, leaderboards,
          memberships and all platform services.
        </div>
      </div>
    </section>
  );
};

function StatusItem({ icon, title }) {
  return (
    <div
      className=" flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <div
          className=" w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-canvas)] text-[var(--headline-accent)] "   >
          {icon}
        </div>

        <span
          className="text-[12px] md:text-[16px] font-medium text-[var(--text-primary)">
          {title}
        </span>
      </div>

      <CheckCircle2 size={20} style={{color:"var(--headline-accent)"}}/>
    </div>
  );
}

export default EmailVerified;