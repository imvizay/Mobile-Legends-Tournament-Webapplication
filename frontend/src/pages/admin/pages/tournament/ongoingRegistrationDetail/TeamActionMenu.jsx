import { Check, Eye, FileText, History as HistoryIcon, LockKeyhole, MessageSquare, MoreVertical, UserRound, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";


function TeamActionMenu({ team, anchorRef, onClose, onReview, onAction }) {
    const menuRef = useRef(null);
    const [position, setPosition] = useState(null);

    const updatePosition = () => {
        if (!anchorRef?.current || !menuRef.current) return;

        const anchor = anchorRef.current.getBoundingClientRect();
        const menu = menuRef.current.getBoundingClientRect();
        const gap = 6;
        const padding = 8;

        let left = anchor.right - menu.width;
        let top = anchor.bottom + gap;

        if (top + menu.height > window.innerHeight - padding) {
            top = anchor.top - menu.height - gap;
        }

        if (top < padding) top = padding;
        if (left < padding) left = padding;
        if (left + menu.width > window.innerWidth - padding) left = window.innerWidth - menu.width - padding;

        setPosition({ top, left });
    };

    useEffect(() => {
        requestAnimationFrame(updatePosition);

        const handleScroll = () => updatePosition();
        const handleResize = () => updatePosition();

        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current?.contains(event.target)) return;
            if (anchorRef?.current?.contains(event.target)) return;
            onClose();
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [anchorRef, onClose]);

    const action = (type) => {
        onAction?.(type, team);
        onClose();
    };

    const menu = (
        <div ref={menuRef} style={position ? { top: position.top, left: position.left } : { top: -9999, left: -9999 }} className="fixed z-[100] w-[218px] overflow-hidden rounded-[11px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-1 shadow-[0_14px_40px_rgba(0,0,0,0.12)]">
            <div className="border-b border-[var(--border-subtle)] px-2.5 py-2">
                <p className="truncate text-[8px] font-bold text-[var(--text-primary)]">{team.team_name || "Unnamed Team"}</p>
                <p className="mt-0.5 text-[6px] text-[var(--text-muted)]">Team registration actions</p>
            </div>

            <div className="py-1">
                <button type="button" onClick={() => action("review")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-[var(--surface-base)]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]"><Check size={12} strokeWidth={2.5} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-[var(--text-primary)]">Mark Review Done</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">Confirm you've reviewed this application</span></span>
                </button>

                <button type="button" onClick={() => action("details")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-[var(--surface-base)]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--surface-base)] text-[var(--text-secondary)]"><Eye size={12} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-[var(--text-primary)]">View Team Details</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">See full team information</span></span>
                </button>

                <button type="button" onClick={() => action("roster")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-[var(--surface-base)]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--surface-base)] text-[var(--text-secondary)]"><UserRound size={12} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-[var(--text-primary)]">View Roster</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">Check confirmed players</span></span>
                </button>

                <button type="button" onClick={() => action("payments")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-[var(--surface-base)]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--surface-base)] text-[var(--text-secondary)]"><FileText size={12} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-[var(--text-primary)]">View Payments</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">See individual payment status</span></span>
                </button>
            </div>

            <div className="border-t border-[var(--border-subtle)] py-1">
                <button type="button" onClick={() => action("lock")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-[var(--surface-base)]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--surface-base)] text-[var(--text-secondary)]"><LockKeyhole size={12} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-[var(--text-primary)]">Lock Final Roster</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">Confirm team for competition</span></span>
                </button>

                <button type="button" onClick={() => action("reject")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-red-500/5">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-red-500/10 text-red-500"><XCircle size={12} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-red-600">Reject Team</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">Mark team as failed</span></span>
                </button>
            </div>

            <div className="border-t border-[var(--border-subtle)] py-1">
                <button type="button" onClick={() => action("message")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-[var(--surface-base)]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--surface-base)] text-[var(--text-secondary)]"><MessageSquare size={12} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-[var(--text-primary)]">Message Captain</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">Send a notification</span></span>
                </button>

                <button type="button" onClick={() => action("note")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-[var(--surface-base)]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--surface-base)] text-[var(--text-secondary)]"><FileText size={12} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-[var(--text-primary)]">Add Note</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">Internal note for this team</span></span>
                </button>
            </div>

            <div className="border-t border-[var(--border-subtle)] py-1">
                <button type="button" onClick={() => action("activity")} className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-left hover:bg-[var(--surface-base)]">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--surface-base)] text-[var(--text-secondary)]"><HistoryIcon size={12} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[8px] font-semibold text-[var(--text-primary)]">View Activity Log</span><span className="mt-0.5 block text-[6px] text-[var(--text-muted)]">See team's registration history</span></span>
                </button>
            </div>
        </div>
    );

    return createPortal(menu, document.body);
}
export default TeamActionMenu