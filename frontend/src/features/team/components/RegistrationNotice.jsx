import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegistrationNotice() {
    return (
        <section className="mt-2 w-full overflow-hidden rounded-[10px] border" style={{ background: "color-mix(in srgb, var(--surface-elevated) 72%, transparent)", borderColor: "var(--border-subtle)" }}>
            <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:px-4 sm:py-2.5">
                <div className="flex min-w-0 items-start gap-3 sm:flex-1 sm:items-center">
                    <div className="relative mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border sm:mt-0" style={{ background: "color-mix(in srgb, var(--accent-gold) 7%, transparent)", borderColor: "color-mix(in srgb, var(--accent-gold) 18%, transparent)" }}>
                        <ShieldCheck size={13} strokeWidth={2} style={{ color: "var(--accent-gold)" }} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="text-[8px] font-bold uppercase tracking-[0.15em] sm:text-[9px]" style={{ color: "var(--text-primary)" }}>
                                REGISTRATION PROTECTED
                            </p>

                            <span className="hidden size-1 rounded-full sm:block" style={{ background: "var(--accent-gold)" }} />

                            <span className="text-[7px] font-semibold uppercase tracking-[0.1em] sm:text-[8px]" style={{ color: "var(--text-muted)" }}>
                                ENTRY FEE PROTECTION
                            </span>
                        </div>

                        <p className="mt-1 text-[8px] leading-[1.45] sm:text-[9px] sm:leading-4" style={{ color: "var(--text-muted)" }}>
                            Your entry fee is held securely during registration. If the team does not complete registration successfully, the paid amount is automatically returned to the respective players&apos; wallets.
                        </p>
                    </div>
                </div>

                <Link to="/refund-policy" className="flex w-full items-center justify-center gap-1.5 border-t pt-2.5 text-[8px] font-bold uppercase tracking-[0.12em] transition-transform hover:-translate-y-px sm:w-auto sm:shrink-0 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0" style={{ color: "var(--accent-gold)", borderColor: "var(--border-subtle)" }}>
                    VIEW REFUND POLICY
                    <ArrowRight size={10} />
                </Link>
            </div>
        </section>
    );
}