const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/heic",
    "image/heif"
];

export const validateTeamDataAndImages = (data, images) => {

    const errors = {}

    const {
        team_name,
        team_bio,
        team_visibility,
        team_region,
        team_language,
        team_communication_link,
        team_tag
    } = data

    const { team_logo, team_banner } = images

    // Team Name
   
    if (!team_name.trim()) {
        errors.team_name = "Team name is required.";
    }
    else if (!/^(?=.*[A-Za-z])[A-Za-z0-9 _-]{3,30}$/.test(team_name.trim())) {
        errors.team_name =
            "Team name must be 3-30 characters and contain at least one letter.";
    }

    // Team Bio
    
    if (!team_bio.trim()) {
        errors.team_bio = "Team bio is required.";
    }
    else if (team_bio.trim().length < 10) {
        errors.team_bio =
            "Team bio should contain at least 10 characters.";
    }
    else if (team_bio.length > 250) {
        errors.team_bio =
            "Team bio cannot exceed 250 characters.";
    }

    // Team Tag

    if (team_tag.trim()) {

        if (!/^[A-Z0-9]{2,5}$/.test(team_tag.trim())) {
            errors.team_tag =
                "Tag should be 2-5 uppercase letters or numbers.";
        }

    }

    // Visibility

    if (!["public", "private"].includes(team_visibility)) {
        errors.team_visibility =
            "Invalid team visibility.";
    }

    // Region

    if (!team_region.trim()) {
        errors.team_region = "Please select a region.";
    }

    // Language

    if (!team_language.trim()) {
        errors.team_language = "Please select a language.";
    }

    // Communication Link

    if (team_communication_link.trim()) {

        try {
            new URL(team_communication_link)
        }
        catch {
            errors.team_communication_link = "Invalid communication link."
        }

    }

    // Image Validation Helper
    const validateImage = (file, field) => {

        if (!file) return

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            errors[field] = "Only PNG, JPG, JPEG, WEBP, HEIC and HEIF images are allowed."
            return
        }

        if (file.size > MAX_IMAGE_SIZE) {
            errors[field] = "Image must be smaller than 5MB."
        }

    }

    validateImage(team_logo, "team_logo")
    validateImage(team_banner, "team_banner")

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }

}