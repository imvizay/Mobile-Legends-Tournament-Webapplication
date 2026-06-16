import { useState,useRef, useEffect } from "react";

import { toast } from "react-toastify";
import { ImagePlus, Upload, Shield , Globe,Link as LinkIcon } from "lucide-react";

// validate team form 
import { validateTeamDataAndImages } from "../../../utils/validators/teamcreationValidator";
import { teamService } from "../../../services/team_service";

import { useMutation } from "@tanstack/react-query";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function TeamCreatePage() {

    const [teamInfo,setTeamInfo] = useState({
        team_name:'',
        team_bio:'',
        team_visibility:'public',
        team_region:'India',
        team_language:'English',
        team_communication_link:'',
        team_tag:'',
    })

    const [teamType,setTeamType] = useState('public')

    const [teamErrors,setTeamErrors] = useState(null)

    const [teamLogoFile,setTeamLogoFile] = useState(null)
    const [logoPreview,setLogoPreview] = useState(null)

    const [teamBgLogoFile,setTeamBgLogoFile] = useState(null) 
    const [bgImagePreview,setBgImagePreview] = useState(null)

    const teamLogoInputRef = useRef(null)
    const teamLogoBgInputRef = useRef(null)

    const createTeamMutation = useMutation({
        mutationFn: teamService.createTeam,

        onSuccess: () => {
            toast.success("Team created successfully.")
        },

        onError: (error) => {
            toast.error( error.response?.data?.message ?? "Unable to create team." )
        },
    })

    // useEffect for preview logo and background image 
    useEffect( () => {
        let logoUrl = null;
        let bgImageUrl = null;

        if(teamLogoFile){
            logoUrl = URL.createObjectURL(teamLogoFile);
            setLogoPreview(logoUrl)
        }

        if(teamBgLogoFile){
            bgImageUrl = URL.createObjectURL(teamBgLogoFile);
            setBgImagePreview(bgImageUrl)
        }

        // cleanup function for revoke url created for preview when component unmounts
        return () => {
            if(logoUrl){
                URL.revokeObjectURL(logoUrl)
            }

            if(bgImageUrl) {
                URL.revokeObjectURL(bgImageUrl)
            }
        };

    },[teamBgLogoFile,teamLogoFile]) 

    useEffect(()=>{
        console.log("team error effect",teamErrors)
    },[teamErrors])

    // HANDLE FILE INPUT
    const handleFileInput = (e) => {
        const file  = e.target.files?.[0]

        if(!file) return;

        if(file.size > MAX_FILE_SIZE){
            toast.warning("Image size must be less than 5MB.")
            return;
        }

        setTeamLogoFile(file)
    }

    const handleBgFileInput = (e) => {
        const file  = e.target.files?.[0]

        if(!file) return;

        if(file.size > MAX_FILE_SIZE){
            toast.warning("Image size must be less than 5MB.")
            return;
        }

        setTeamBgLogoFile(file)
    }

    // HANDLE INPUT REF CLICKS 
    const handleLogoClick = () => {
        teamLogoInputRef.current?.click();
    }

    const handleBannerClick = () => {
        teamLogoBgInputRef.current?.click();
    }

    // handle team information inputs

    const handleInputChange = (e) => {
        const {name,value} = e.target;

        setTeamInfo( (p) =>
            ({
                ...p,
                [name]:value
            }) 
        )
     }      

  
    // handle team form submission.

    const handleTeamSubmission = async () => {

        if(isPending) return;

        const images = {
          team_logo: teamLogoFile,
          team_banner: teamBgLogoFile,
        }

        // frontend validation for team data information 
        const {isValid,errors} = validateTeamDataAndImages(teamInfo,images) 
        
        if(!isValid){
            setTeamErrors(errors)
            return
        }

        // API Call To Create Team
        try{
            const formData = new FormData()
            formData.append("team_logo",teamLogoFile)
            formData.append("team_banner",teamBgLogoFile)

            Object.entries(teamInfo).forEach(([Key,value]) => {
                formData.append(Key,value)
            })

            const data = await createTeamMutation.mutateAsync(formData);

            setTeamInfo({
                team_name: "",
                team_bio: "",
                team_visibility: "public",
                team_region: "India",
                team_language: "English",
                team_communication_link: "",
                team_tag: "",
            })

            setTeamLogoFile(null)
            setTeamBgLogoFile(null)
            setTeamErrors(null)
        }
        catch(error){
            console.log("team creation api endpoint error",error)
        }
    }


  return (
    <section className="h-full">

      <div className="grid lg:grid-cols-[1fr_300px] gap-4 h-full">

        {/* Scrollable Form */}
        <div className="team-form-scrollbar overflow-y-auto h-full pr-2">

          <div className="bg-[var(--surface-base)] border border-[var(--border-default)] rounded-3xl p-4">

            {/* Header */}
            <div className="mb-4">
              <button className="text-xs text-[var(--text-secondary)]">
                ← Back to Teams
              </button>

              <h1 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                Create Team
              </h1>

              <p className="text-xs text-[var(--text-secondary)]">
                Build your squad and compete in tournaments.
              </p>
            </div>

            {/* ================= TEAM IDENTITY ================= */}
            <div className="mb-6">

              <div className="flex items-center gap-2 mb-3">
                <Shield className="size-4 text-[var(--accent-gold)]" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                  Team Identity
                </h2>
              </div>

              <div className="grid grid-cols-[90px_1fr] gap-3 mb-3">

                <button 
                onClick={handleLogoClick}
                className="h-[90px] rounded-xl border border-dashed border-[var(--border-default)] flex flex-col items-center justify-center gap-1 hover:bg-[var(--surface-elevated)] transition-all">
                  <Upload size={18} />
                  <span className="text-[11px]">Logo </span>
                  <input 
                    ref = {teamLogoInputRef} 
                    onChange={handleFileInput} 
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
                    type="file" 
                    className="hidden" 
                  />

                </button>

                <button 
                onClick={handleBannerClick}
                className="h-[90px] rounded-xl border border-dashed border-[var(--border-default)] flex flex-col items-center justify-center gap-1 hover:bg-[var(--surface-elevated)] transition-all">
                  <ImagePlus size={18} />
                  <span className="text-[11px]">Banner</span>
                  <input 
                    ref = {teamLogoBgInputRef} 
                    onChange={handleBgFileInput} 
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
                    type="file" 
                    className="hidden" 
                  />

                </button>

                {teamErrors?.team_logo && <p className="text-[10px] text-red-400">* {teamErrors?.team_logo || ""}</p> }
                {teamErrors?.team_banner && <p className="text-[10px] text-red-400">* {teamErrors?.team_banner || ""}</p> }

              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-3">

                <div>
                  <label className="text-[11px] mb-1 block">Team Name</label>
                  <input 
                  name="team_name"
                  onChange={handleInputChange} 
                  value={teamInfo.team_name || ""}

                  placeholder="Black Dragons" 
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-transparent text-sm outline-none" />

                  {teamErrors?.team_name && <p className="text-[10px] text-red-400">* {teamErrors?.team_name || ""}</p> }
                </div>

                <div>
                  <label className="text-[11px] mb-1 block">Team Tag</label>
                  <input
                    name="team_tag"
                    onChange={handleInputChange} 
                    value={teamInfo.team_tag || ""}
                   placeholder="BD" 
                   className="w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-transparent text-sm outline-none" />
                </div>

              </div>

              <div>

                <label className="text-[11px] mb-1 block">
                  Team Bio
                </label>

                <textarea
                  rows={4}
                  name="team_bio"
                  onChange={handleInputChange} 
                  value={teamInfo.team_bio || ""}

                  placeholder="Tell players about your team..."
                  className="w-full resize-none rounded-lg border border-[var(--border-default)] bg-transparent p-3 text-sm outline-none"
                />  
                {teamErrors?.team_bio && <p className="text-[10px] text-red-400">* {teamErrors?.team_bio || ""}</p> }
              </div>

            </div>

            {/* ================= TEAM SETTINGS ================= */}
            <div className="mb-6">

              <div className="flex items-center gap-2 mb-3">
                <Globe className="size-4 text-[var(--accent-gold)]" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                  Team Settings
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-3">

                <button onClick={ () => setTeamType('public')} className="p-4 rounded-2xl border border-[var(--accent-gold)] bg-[var(--accent-gold)]/5 text-left hover:bg-[var(--accent-gold)]/10 transition-all">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Public Team
                  </h3>

                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Players can discover and request to join.
                  </p>
                </button>

                <button onClick={ () => setTeamType('private')} className="p-4 rounded-2xl border border-[var(--border-default)] text-left hover:bg-[var(--surface-elevated)] transition-all">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Private Team
                  </h3>

                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    Join through invitation only.
                  </p>
                </button>

              </div>

              <div className="grid md:grid-cols-2 gap-3">

                <div>
                  <label className="text-[11px] mb-1 block">
                    Region
                  </label>

                  <select 
                  name='team_region' 
                
                  onChange={handleInputChange} 
                  value={teamInfo.team_region || ""}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-transparent text-sm">
                    <option>India</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] mb-1 block">
                    Preferred Language
                  </label>

                  <select name="team_language" onChange={handleInputChange} value={teamInfo.team_language} className="w-full h-10 px-3 rounded-lg border border-[var(--border-default)] bg-transparent text-sm">
                    <option>English</option>
                  </select>
                </div>

              </div>

            </div>

            {/* ================= COMMUNICATION ================= */}
            <div className="mb-6">

              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="size-4 text-[var(--accent-gold)]" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                  Communication 
                </h2>
              </div>

              <div className="relative">

                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)]" />

                <input
                  placeholder="https://discord.gg/..."
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-[var(--border-default)] bg-transparent text-sm outline-none"
                />

              </div>

            </div>

            <button disabled={isPending} onClick={handleTeamSubmission}  
            className="
            disabled:opacity-50 disabled:pointer-events-none 
            w-full h-11 rounded-xl 
            bg-[var(--action-primary-bg)] text-[var(--action-primary-text)] text-sm font-medium"
            >
               {isPending ? "Creating Team..." : "Create Team"}
            </button>

          </div>

        </div>

        {/* Preview */}
        <aside className="hidden lg:flex flex-col gap-4">
       
        
         <div className="bg-[var(--surface-base)] border border-[var(--border-default)] rounded-3xl p-4">
       
           <h3 className="text-xs font-semibold uppercase tracking-[0.15em] mb-3">
             Live Preview
           </h3>
       
           <div className="overflow-hidden object-cover rounded-3xl bg-black">
       
             <div className="h-28 bg-zinc-800 overflow-hidden">

                {bgImagePreview ? (
                    <img 
                        src={bgImagePreview} 
                        alt="team background image logo" 
                        className="h-full w-full object-cover"/>
                    ) 
                        : null}
             </div>
       
             <div className="relative px-4 pb-4">
       
               <div className="overflow-hidden object-cover absolute -top-10 size-20 rounded-2xl border-4 border-black bg-[var(--accent-gold)]">
                {logoPreview ? (
                              <img
                                src={logoPreview}
                                alt="Team Logo"
                                className="h-full w-full object-cover"
                              />
                        ) : null}
                </div> 
       
               <div className="pt-10">
       
                 <h4 className="font-semibold text-white">
                   {teamInfo.team_name ? teamInfo.team_name : "Team Pheonix"}
                 </h4>
       
                 <p className="text-xs text-zinc-400">
                   {teamInfo.team_tag ? teamInfo.team_tag : "PHX • India"}
                 </p>
       
                 <p className="mt-3 text-xs leading-relaxed text-zinc-300">
                   {teamInfo.team_bio ? teamInfo.team_bio : "Competitive MLBB squad focused on tournament victories, teamwork and continuous growth."}
                 </p>
       
               </div>
       
             </div>
       
           </div>
       
         </div>
       
         {/* Tips */}
         <div className="bg-[var(--surface-base)] border border-[var(--border-default)] rounded-3xl p-4">
       
           <h3 className="text-xs font-semibold uppercase tracking-[0.15em] mb-4">
             Team Creation Tips
           </h3>
       
           <div className="space-y-3">
       
             <div className="flex gap-3">
               <span className="size-2 rounded-full bg-[var(--accent-gold)] mt-1.5" />
               <p className="text-[11px] text-[var(--text-secondary)]">
                 Choose a unique and memorable team name.
               </p>
             </div>
       
             <div className="flex gap-3">
               <span className="size-2 rounded-full bg-emerald-500 mt-1.5" />
               <p className="text-[11px] text-[var(--text-secondary)]">
                 Keep your team tag short and recognizable.
               </p>
             </div>
       
             <div className="flex gap-3">
               <span className="size-2 rounded-full bg-blue-500 mt-1.5" />
               <p className="text-[11px] text-[var(--text-secondary)]">
                 Upload a high quality logo and banner.
               </p>
             </div>
              
           </div>
       
         </div>
       
       </aside>

      </div>

    </section>
  );
}

export default TeamCreatePage;