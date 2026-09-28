
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Eye,
  Globe,
  ImagePlus,
  Link as LinkIcon,
  Lock,
  Shield,
  Swords,
  Upload,
  Users,
} from "lucide-react";

import { validateTeamDataAndImages } from "../../../utils/validators/teamcreationValidator";
import { teamService } from "../../../services/teamService";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialTeamInfo = {
  team_name: "",
  team_tag: "",
  team_bio: "",
  team_visibility: "public",
  team_country: "India",
  team_region: "",
  team_city: "",
  team_language: "English",
  team_communication_link: "",
};

function CreateTeamPage() {
  const navigate = useNavigate();

  const [teamInfo, setTeamInfo] = useState(initialTeamInfo);
  const [teamErrors, setTeamErrors] = useState({});
  const [teamLogoFile, setTeamLogoFile] = useState(null);
  const [teamBannerFile, setTeamBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const { mutateAsync: createTeam, isPending } = useMutation({
    mutationFn: teamService.createTeam,
    onSuccess: () => toast.success("Team created successfully."),
    onError: (error) =>
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to create team."
      ),
  });

  useEffect(() => {
    if (!teamLogoFile) {
      setLogoPreview(null);
      return;
    }

    const url = URL.createObjectURL(teamLogoFile);
    setLogoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [teamLogoFile]);

  useEffect(() => {
    if (!teamBannerFile) {
      setBannerPreview(null);
      return;
    }

    const url = URL.createObjectURL(teamBannerFile);
    setBannerPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [teamBannerFile]);

  const handleInputChange = ({ target: { name, value } }) => {
    setTeamInfo((previous) => ({ ...previous, [name]: value }));

    if (teamErrors[name]) {
      setTeamErrors((previous) => ({ ...previous, [name]: null }));
    }
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.warning("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.warning("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (type === "logo") {
      setTeamLogoFile(file);
      setTeamErrors((previous) => ({ ...previous, team_logo: null }));
    }

    if (type === "banner") {
      setTeamBannerFile(file);
      setTeamErrors((previous) => ({ ...previous, team_banner: null }));
    }
  };

  const handleVisibilityChange = (visibility) => {
    setTeamInfo((previous) => ({ ...previous, team_visibility: visibility }));
  };

  const handleSubmit = async () => {
    if (isPending) return;

    const validationData = {
      ...teamInfo,
      team_name: teamInfo.team_name,
      team_tag: teamInfo.team_tag,
      team_bio: teamInfo.team_bio,
      team_visibility: teamInfo.team_visibility,
      team_country: teamInfo.team_country,
      team_region:teamInfo.team_region,
      team_city:teamInfo.team_city,
      team_communication_link: teamInfo.team_communication_link,
    };

    const images = {
      team_logo: teamLogoFile,
      team_banner: teamBannerFile,
    };

    const { isValid, errors } = validateTeamDataAndImages(
      validationData,
      images
    );

    if (!isValid) {
      setTeamErrors(errors || {});
      toast.warning("Please complete the required team information.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("team_name", teamInfo?.team_name?.trim());
      formData.append("team_tag", teamInfo?.team_tag?.trim().toUpperCase());
      formData.append("description", teamInfo?.team_bio?.trim());
      formData.append("visibility", teamInfo?.team_visibility);
      formData.append("country", teamInfo?.team_country);
      formData.append("region", teamInfo?.team_region?.trim());
      formData.append("city", teamInfo?.team_city?.trim());
      formData.append(
        "communication_link",
        teamInfo?.communication_link?.trim()
      );

      if (teamLogoFile) formData.append("logo", teamLogoFile);
      if (teamBannerFile) formData.append("banner", teamBannerFile);

      await createTeam(formData);

      setTeamInfo(initialTeamInfo);
      setTeamErrors({});
      setTeamLogoFile(null);
      setTeamBannerFile(null);

      navigate("/player/team");
    } catch (error) {
      console.error("Team creation error:", error);
    }
  };

  const previewName = teamInfo.team_name || "Team Phoenix";
  const previewTag = teamInfo.team_tag || "PHX";

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1680px]">

        {/* Compact Header */}
        <div className="mb-5 border-b border-[var(--border-default)] pb-4 sm:mb-6 sm:pb-5">
          <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.13em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <span className="flex size-7 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] transition-colors group-hover:border-[var(--accent-gold)]">
                <ArrowLeft size={13} />
              </span>

              Back to Teams
            </button>

            <span className="hidden items-center gap-2 text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:flex">
              <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />
              Team Workspace
            </span>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-3">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border sm:size-9 sm:rounded-xl"
              style={{
                background:
                  "color-mix(in srgb, var(--accent-gold) 7%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--accent-gold) 18%, var(--border-default))",
              }}
            >
              <Swords size={15} className="text-[var(--accent-gold)]" />
            </span>

            <div>
              <h1 className="text-[20px] font-black tracking-[-0.035em] text-[var(--headline-primary)] sm:text-[27px]">
                Create your team
              </h1>

              <p className="mt-1 max-w-2xl text-[8px] leading-relaxed text-[var(--text-muted)] sm:mt-1.5 sm:text-[10px]">
                Establish your competitive identity, control how players join,
                and begin building your roster.
              </p>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">

          {/* Main Configuration */}
          <main className="min-w-0">
            <div className="overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)] sm:rounded-[20px]">

              {/* TEAM IDENTITY */}
              <section className="p-3.5 sm:p-5 lg:p-6">
                <SectionLabel
                  icon={<Shield size={13} />}
                  title="Team Identity"
                  description="Build the identity players will recognize across tournaments and team spaces."
                />

                <div className="mt-4 grid gap-3.5 sm:mt-5 sm:gap-4 lg:grid-cols-[150px_minmax(0,1fr)]">

                  {/* Logo */}
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className={`group relative aspect-square w-[108px] overflow-hidden rounded-[15px] border border-dashed transition-colors sm:w-full sm:rounded-[18px] ${
                      logoPreview
                        ? "border-[var(--accent-gold)]/40"
                        : "border-[var(--border-default)] hover:border-[var(--accent-gold)]"
                    }`}
                  >
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="Team logo preview"
                          className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1.5 backdrop-blur-sm sm:px-3 sm:py-2">
                          <span className="text-[6px] font-bold uppercase tracking-[0.12em] text-white sm:text-[7px]">
                            Change Logo
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center px-2 sm:px-4">
                        <span className="flex size-8 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--accent-gold)] sm:size-10 sm:rounded-xl">
                          <Upload size={14} className="sm:hidden" />
                          <Upload size={16} className="hidden sm:block" />
                        </span>

                        <span className="mt-2 text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)] sm:mt-3 sm:text-[8px]">
                          Team Logo
                        </span>

                        <span className="mt-0.5 text-[6px] text-[var(--text-muted)] sm:mt-1 sm:text-[7px]">
                          Square image
                        </span>
                      </div>
                    )}

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handleFileChange(event, "logo")
                      }
                    />
                  </button>

                  {/* Name / Tag */}
                  <div className="min-w-0">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_130px]">

                      <Field
                        label="Team Name"
                        error={teamErrors?.team_name}
                      >
                        <input
                          name="team_name"
                          value={teamInfo.team_name}
                          onChange={handleInputChange}
                          placeholder="Black Dragons"
                          maxLength={60}
                          className={inputClass}
                        />
                      </Field>

                      <Field
                        label="Team Tag"
                        error={teamErrors?.team_tag}
                      >
                        <input
                          name="team_tag"
                          value={teamInfo.team_tag}
                          onChange={handleInputChange}
                          placeholder="BD"
                          maxLength={10}
                          className={`${inputClass} uppercase`}
                        />
                      </Field>

                    </div>

                    <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-2.5 sm:mt-4 sm:gap-3 sm:px-3 sm:py-3">
                      <span
                        className="flex size-6 shrink-0 items-center justify-center rounded-lg border sm:size-7"
                        style={{
                          background:
                            "color-mix(in srgb, var(--accent-gold) 5%, transparent)",
                          borderColor:
                            "color-mix(in srgb, var(--accent-gold) 14%, var(--border-default))",
                        }}
                      >
                        <Crown size={11} className="text-[var(--accent-gold)]" />
                      </span>

                      <div>
                        <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-[var(--text-primary)] sm:text-[8px]">
                          Captain Assignment
                        </p>

                        <p className="mt-0.5 text-[6.5px] leading-relaxed text-[var(--text-muted)] sm:mt-1 sm:text-[7px]">
                          You will become the captain and manage membership,
                          competitive rosters, and tournament participation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner */}
                <div className="mt-4 border-t border-[var(--border-subtle)] pt-4 sm:mt-5 sm:pt-5">
                  <div className="mb-2.5 flex items-center justify-between gap-3 sm:mb-3">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                        Team Banner
                      </p>

                      <p className="mt-0.5 text-[6.5px] text-[var(--text-muted)] sm:mt-1 sm:text-[7px]">
                        Represents your squad across team and tournament spaces.
                      </p>
                    </div>

                    <span className="text-[6.5px] text-[var(--text-muted)] sm:text-[7px]">
                      Max 5 MB
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className={`group relative min-h-[105px] w-full overflow-hidden rounded-[15px] border border-dashed transition-colors sm:min-h-[170px] sm:rounded-[18px] ${
                      bannerPreview
                        ? "border-[var(--accent-gold)]/40"
                        : "border-[var(--border-default)] hover:border-[var(--accent-gold)]"
                    }`}
                  >
                    {bannerPreview ? (
                      <>
                        <img
                          src={bannerPreview}
                          alt="Team banner preview"
                          className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/65 px-2.5 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
                          <span className="text-[6px] font-bold uppercase tracking-[0.12em] text-white sm:text-[7px]">
                            Replace Banner
                          </span>

                          <ImagePlus
                            size={12}
                            className="text-white/80 sm:size-[13px]"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex min-h-[105px] flex-col items-center justify-center px-4 sm:min-h-[170px] sm:px-5">
                        <span className="flex size-8 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--accent-gold)] sm:size-10 sm:rounded-xl">
                          <ImagePlus size={14} className="sm:hidden" />
                          <ImagePlus size={17} className="hidden sm:block" />
                        </span>

                        <p className="mt-2 text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)] sm:mt-3 sm:text-[9px]">
                          Upload Team Banner
                        </p>

                        <p className="mt-0.5 text-[6px] text-[var(--text-muted)] sm:mt-1 sm:text-[7px]">
                          Wide images are recommended
                        </p>
                      </div>
                    )}

                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handleFileChange(event, "banner")
                      }
                    />
                  </button>

                  {(teamErrors?.team_logo || teamErrors?.team_banner) && (
                    <div className="mt-2">
                      {teamErrors?.team_logo && (
                        <p className="text-[8px] text-red-400">
                          * {teamErrors.team_logo}
                        </p>
                      )}

                      {teamErrors?.team_banner && (
                        <p className="text-[8px] text-red-400">
                          * {teamErrors.team_banner}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-4 sm:mt-5">
                  <Field
                    label="Team Description"
                    error={teamErrors?.team_bio}
                  >
                    <textarea
                      rows={4}
                      name="team_bio"
                      value={teamInfo.team_bio}
                      onChange={handleInputChange}
                      placeholder="Describe your team's competitive identity, ambitions, and the kind of players you want to build with."
                      className={textareaClass}
                    />
                  </Field>
                </div>
              </section>

              {/* TEAM ACCESS */}
              <section className="border-t border-[var(--border-subtle)] p-3.5 sm:p-5 lg:p-6">
                <SectionLabel
                  icon={<Users size={13} />}
                  title="Team Access"
                  description="Control how players discover and join your team."
                />

                <div className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                  <AccessCard
                    active={teamInfo.team_visibility === "public"}
                    icon={<Globe size={15} />}
                    title="Public Team"
                    description="Your team appears in discovery and players can request to join."
                    onClick={() => handleVisibilityChange("public")}
                  />

                  <AccessCard
                    active={teamInfo.team_visibility === "private"}
                    icon={<Lock size={15} />}
                    title="Private Team"
                    description="Membership is controlled through direct captain invitations."
                    onClick={() => handleVisibilityChange("private")}
                  />
                </div>

                <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2">
                  <Field label="Country">
                    <select
                      name="team_country"
                      value={teamInfo.team_country}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="India">India</option>
                    </select>
                  </Field>

                  <Field label="Region / State">
                    <input
                      name="team_region"
                      value={teamInfo.team_region}
                      onChange={handleInputChange}
                      placeholder="Madhya Pradesh"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="City">
                    <input
                      name="team_city"
                      value={teamInfo.team_city}
                      onChange={handleInputChange}
                      placeholder="Bhopal"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Communication Link">
                    <div className="relative">
                      <LinkIcon
                        size={13}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                      />

                      <input
                        name="team_communication_link"
                        value={teamInfo.team_communication_link}
                        onChange={handleInputChange}
                        placeholder="Discord or other team channel"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </Field>
                </div>
              </section>

              {/* Footer */}
              <div className="flex flex-col gap-2.5 border-t border-[var(--border-default)] bg-[var(--surface-elevated)] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-start gap-2">
                  <Shield
                    size={12}
                    className="mt-0.5 shrink-0 text-[var(--accent-gold)]"
                  />

                  <p className="max-w-xl text-[7px] leading-relaxed text-[var(--text-muted)]">
                    Creating a team assigns you as captain. You will be
                    responsible for membership management, roster selection,
                    and tournament participation.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleSubmit}
                  className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--action-primary-bg)] px-5 text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--action-primary-text)] transition-transform hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                >
                  {isPending ? "Creating Team..." : "Create Team"}

                  {!isPending && <ArrowRight size={13} />}
                </button>
              </div>
            </div>
          </main>

          {/* LIVE PREVIEW */}
          <aside className="min-w-0">
            <div className="sticky top-4">
              <div className="overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)] sm:rounded-[20px]">

                <div className="border-b border-[var(--border-subtle)] px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2">
                    <Eye size={12} className="text-[var(--accent-gold)]" />

                    <div>
                      <h3 className="text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                        Team Preview
                      </h3>

                      <p className="mt-0.5 text-[6.5px] text-[var(--text-muted)] sm:text-[7px]">
                        Your identity updates as you build it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3">
                  <div className="overflow-hidden rounded-[14px] border border-[var(--border-default)] bg-[#111] sm:rounded-[16px]">

                    {/* Preview Banner */}
                    <div className="relative h-24 overflow-hidden bg-[var(--surface-elevated)] sm:h-32">
                      {bannerPreview ? (
                        <img
                          src={bannerPreview}
                          alt="Preview banner"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage:
                                "linear-gradient(45deg, transparent 45%, var(--accent-gold) 46%, transparent 47%), linear-gradient(-45deg, transparent 45%, var(--accent-gold) 46%, transparent 47%)",
                              backgroundSize: "28px 28px",
                            }}
                          />

                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-gold)]/20 via-transparent to-transparent" />
                        </>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent sm:h-16" />
                    </div>

                    {/* Preview Content */}
                    <div className="relative px-3 pb-3 sm:px-4 sm:pb-4">

                      <div className="absolute -top-7 flex size-[54px] items-center justify-center overflow-hidden rounded-[13px] border-[3px] border-[#111] bg-[var(--accent-gold)] text-[17px] font-black text-black sm:-top-9 sm:size-[68px] sm:rounded-[16px] sm:text-[20px]">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Team logo preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          previewName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="pt-9 sm:pt-11">
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="min-w-0">
                            <h4 className="truncate text-[13px] font-black uppercase tracking-[-0.02em] text-white sm:text-[15px]">
                              {previewName}
                            </h4>

                            <div className="mt-0.5 flex items-center gap-1.5 sm:mt-1 sm:gap-2">
                              <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[5.5px] font-bold uppercase tracking-[0.1em] text-[var(--accent-gold)] sm:text-[6px]">
                                {previewTag}
                              </span>

                              <span className="text-[6px] text-zinc-500 sm:text-[7px]">
                                {teamInfo.team_country}
                              </span>
                            </div>
                          </div>

                          <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[var(--accent-gold)] sm:size-6 sm:rounded-lg">
                            {teamInfo.team_visibility === "public" ? (
                              <Globe size={10} />
                            ) : (
                              <Lock size={10} />
                            )}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-3 text-[7px] leading-[1.6] text-zinc-400 sm:mt-4 sm:line-clamp-4 sm:text-[8px] sm:leading-[1.7]">
                          {teamInfo.team_bio ||
                            "Your competitive team identity will appear here as you define your squad."}
                        </p>

                        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 sm:mt-4 sm:pt-3">
                          <div className="flex items-center gap-1.5">
                            <Users size={10} className="text-zinc-500" />

                            <span className="text-[6px] font-semibold text-zinc-400 sm:text-[7px]">
                              1 / 7 Members
                            </span>
                          </div>

                          <span className="text-[5.5px] font-bold uppercase tracking-[0.1em] text-[var(--accent-gold)] sm:text-[6px]">
                            Captain
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-2 sm:mt-3 sm:px-3 sm:py-2.5">
                    <Eye
                      size={10}
                      className="mt-0.5 shrink-0 text-[var(--accent-gold)]"
                    />

                    <p className="text-[6.5px] leading-relaxed text-[var(--text-muted)] sm:text-[7px]">
                      This preview reflects your team identity in real time.
                      Team assets and details will update automatically as you
                      configure them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3.5 text-[10px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]";

const textareaClass =
  "w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3.5 py-3 text-[10px] leading-relaxed text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-gold)]";

function SectionLabel({ icon, title, description }) {
  return (
    <div className="flex gap-2.5 sm:gap-3">
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-lg border text-[var(--accent-gold)] sm:size-8"
        style={{
          background:
            "color-mix(in srgb, var(--accent-gold) 5%, transparent)",
          borderColor:
            "color-mix(in srgb, var(--accent-gold) 14%, var(--border-default))",
        }}
      >
        {icon}
      </span>

      <div>
        <h2 className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] sm:text-[10px]">
          {title}
        </h2>

        <p className="mt-0.5 text-[7px] leading-relaxed text-[var(--text-muted)] sm:mt-1 sm:text-[8px]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-[8px] font-medium text-red-400">
          * {error}
        </p>
      )}
    </div>
  );
}

function AccessCard({ active, icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[14px] border p-3 text-left transition-colors sm:rounded-[15px] sm:p-3.5 ${
        active
          ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/[0.04]"
          : "border-[var(--border-default)] bg-[var(--surface-elevated)] hover:border-[var(--text-muted)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[var(--accent-gold)]">{icon}</span>

        {active && (
          <span className="flex size-5 items-center justify-center rounded-full bg-[var(--accent-gold)] text-black">
            <Check size={11} strokeWidth={3} />
          </span>
        )}
      </div>

      <h3 className="mt-2.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[var(--text-primary)] sm:mt-3 sm:text-[9px]">
        {title}
      </h3>

      <p className="mt-1 text-[6.5px] leading-relaxed text-[var(--text-muted)] sm:text-[7px]">
        {description}
      </p>
    </button>
  );
}

export default CreateTeamPage;

