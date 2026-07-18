import { HiOutlineShieldCheck } from "react-icons/hi2";

const AccountSecurity = () => {
  return (
    <div className="rounded-3xl border bg-white p-4 shadow-sm">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Account Security
      </h3>

      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-white p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-200 bg-white">
          <HiOutlineShieldCheck className="text-xl text-amber-500" />
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-green-700">
            Entry Locked
          </h4>

          <p className="mt-0.5 text-xs text-neutral-500">
            All team members have completed their entry payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;