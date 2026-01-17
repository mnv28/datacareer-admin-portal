import { LANDING_PAGE_HERO, LANDING_PAGE_FEATURES_HEADER } from "../api/constApi";
import { apiInstance } from "../api/axiosApi";
import { ApiError } from "../types/auth";

export interface HeroPayload {
    content: {
        badgeText: string;
        mainHeading: string;
    }
}

export interface FeaturesHeaderPayload {
    content: {
        title: string;
    };
}

export interface DataSkiesPayload {
    content: {
        title: string;
    };
}

export interface SqlSectionPayload {
    content: {
        title: string;
        subtitle: string;
    };
}

export interface PricingHeaderPayload {
    content: {
        mainTitle: string;
        mainSubtitle: string;
    };
}

export interface PricingCardPayload {
    content: {
        planName: string;
        badge: string;
        price: string;
        points: string[];
    };
}

export interface HowItWorksPayload {
    content: {
        title: string;
        subtitle: string;
    };
}

export interface MapSectionPayload {
    content: {
        title: string;
        points: string[];
    };
}

export interface FaqHeaderPayload {
    content: {
        mainTitle: string;
        mainSubtitle: string;
    };
}

export interface InterviewQuestionsHeaderPayload {
    content: {
        title: string;
        subtitle: string;
        description: string;
    };
}

export interface ComingSoonHeaderPayload {
    content: {
        mainTitle: string;
    };
}

export interface SubHeroPayload {
    content: {
        title: string;
        subtitle: string;
    };
}

export const updateHeroSection = async (payload: HeroPayload) => {
    return updateSectionContent('hero', payload.content);
};

export const updateFeaturesHeader = async (payload: FeaturesHeaderPayload) => {
    return updateSectionContent('features_header', payload.content);
};

export const updateDataSkies = async (payload: DataSkiesPayload) => {
    return updateSectionContent('data_skies', payload.content);
};

export const updateSqlSection = async (payload: SqlSectionPayload) => {
    return updateSectionContent('sql_section', payload.content);
};

export const updatePricingHeader = async (payload: PricingHeaderPayload) => {
    return updateSectionContent('pricing_header', payload.content);
};

export const updatePricingCard = async (payload: PricingCardPayload) => {
    return updateSectionContent('pricing_card', payload.content);
};

export const updateHowItWorks = async (payload: HowItWorksPayload) => {
    return updateSectionContent('how_it_works', payload.content);
};

export const updateMapSection = async (payload: MapSectionPayload) => {
    return updateSectionContent('map_section', payload.content);
};

export const updateFaqHeader = async (payload: FaqHeaderPayload) => {
    return updateSectionContent('faq_header', payload.content);
};

export const updateInterviewQuestionsHeader = async (payload: InterviewQuestionsHeaderPayload) => {
    return updateSectionContent('interview_questions_header', payload.content);
};

export const updateComingSoonHeader = async (payload: ComingSoonHeaderPayload) => {
    return updateSectionContent('coming_soon_header', payload.content);
};

export const updateSubHero = async (payload: SubHeroPayload) => {
    return updateSectionContent('sub_hero', payload.content);
};

export const updateSectionContent = async (sectionName: string, content: any) => {
    const url = sectionName.startsWith('feature_')
        ? `/api/admin/landing-page/feature/${sectionName}`
        : `/api/admin/landing-page/${sectionName}`;

    try {
        const response = await apiInstance.put(url, { content });
        return response.data;
    } catch (error: any) {
        return handleApiError(error);
    }
};

export const updateFeatureWithVideo = async (featureId: string, content: any, videoFile?: File) => {
    const formData = new FormData();
    if (videoFile) {
        formData.append('video', videoFile);
    }
    formData.append('content', JSON.stringify(content));

    try {
        const response = await apiInstance.put(
            `/api/admin/landing-page/feature/${featureId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: any) {
        return handleApiError(error);
    }
};

const handleApiError = (error: any) => {
    if (error.response) {
        throw {
            message: error.response.data?.message || 'Update failed',
            statusCode: error.response.status,
            error: error.response.data?.error
        } as ApiError;
    } else if (error.request) {
        throw {
            message: 'No response from server',
            statusCode: 500,
            error: 'Network Error'
        } as ApiError;
    } else {
        throw {
            message: 'An unexpected error occurred',
            statusCode: 500,
            error: error.message
        } as ApiError;
    }
};
