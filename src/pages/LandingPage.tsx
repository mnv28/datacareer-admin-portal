
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    updateHeroSection,
    updateSectionContent,
    updateFeatureWithVideo,
    updateFeaturesHeader,
    updateDataSkies,
    updateSqlSection,
    updatePricingHeader,
    updatePricingCard,
    updateHowItWorks,
    updateMapSection,
    updateFaqHeader,
    updateInterviewQuestionsHeader,
    updateComingSoonHeader,
    updateSubHero,
    getLandingPageSection
} from '@/services/landingPageService';
import { useEffect } from 'react';

const LandingPage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [featureLoading, setFeatureLoading] = useState(false);
    const [headerLoading, setHeaderLoading] = useState(false);
    const [dataSkiesLoading, setDataSkiesLoading] = useState(false);
    const [sqlSectionLoading, setSqlSectionLoading] = useState(false);
    const [pricingHeaderLoading, setPricingHeaderLoading] = useState(false);
    const [pricingCardLoading, setPricingCardLoading] = useState(false);
    const [howItWorksLoading, setHowItWorksLoading] = useState(false);
    const [mapSectionLoading, setMapSectionLoading] = useState(false);
    const [faqHeaderLoading, setFaqHeaderLoading] = useState(false);
    const [interviewQuestionsHeaderLoading, setInterviewQuestionsHeaderLoading] = useState(false);
    const [subHeroLoading, setSubHeroLoading] = useState(false);
    const [comingSoonHeaderLoading, setComingSoonHeaderLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

    const [heroContent, setHeroContent] = useState({
        badgeText: '',
        mainHeading: '',
    });

    const [featuresHeader, setFeaturesHeader] = useState({
        title: '',
    });

    const [dataSkies, setDataSkies] = useState({
        title: '',
    });

    const [sqlSection, setSqlSection] = useState({
        title: '',
        subtitle: '',
    });

    const [pricingHeader, setPricingHeader] = useState({
        mainTitle: '',
        mainSubtitle: '',
    });

    const [pricingCard, setPricingCard] = useState({
        planName: '',
        badge: '',
        price: '',
        points: ['', '', ''],
    });

    const [howItWorks, setHowItWorks] = useState({
        title: '',
        subtitle: '',
    });

    const [mapSection, setMapSection] = useState({
        title: '',
        points: ['', '', ''],
    });

    const [faqHeader, setFaqHeader] = useState({
        mainTitle: '',
        mainSubtitle: '',
    });

    const [interviewQuestionsHeader, setInterviewQuestionsHeader] = useState({
        title: '',
        subtitle: '',
        description: '',
    });

    const [subHero, setSubHero] = useState({
        title: '',
        subtitle: '',
    });

    const [comingSoonHeader, setComingSoonHeader] = useState({
        mainTitle: '',
    });

    const [featureData, setFeatureData] = useState({
        sectionId: 'feature_1',
        title: '',
        subtitle: '',
        points: ['', '', ''],
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch Hero
            const heroRes = await getLandingPageSection('hero');
            if (heroRes?.content) {
                setHeroContent({
                    badgeText: heroRes.content.badgeText || '',
                    mainHeading: heroRes.content.mainHeading || '',
                });
            }

            // Fetch Features Header
            const featuresHeaderRes = await getLandingPageSection('features_header');
            if (featuresHeaderRes?.content) {
                setFeaturesHeader({
                    title: featuresHeaderRes.content.title || '',
                });
            }

            // Fetch Data Skies
            const dataSkiesRes = await getLandingPageSection('data_skies');
            if (dataSkiesRes?.content) {
                setDataSkies({
                    title: dataSkiesRes.content.title || '',
                });
            }

            // Fetch SQL Section
            const sqlSectionRes = await getLandingPageSection('sql_section');
            if (sqlSectionRes?.content) {
                setSqlSection({
                    title: sqlSectionRes.content.title || '',
                    subtitle: sqlSectionRes.content.subtitle || '',
                });
            }

            // Fetch Pricing Header
            const pricingHeaderRes = await getLandingPageSection('pricing_header');
            if (pricingHeaderRes?.content) {
                setPricingHeader({
                    mainTitle: pricingHeaderRes.content.mainTitle || '',
                    mainSubtitle: pricingHeaderRes.content.mainSubtitle || '',
                });
            }

            // Fetch Pricing Card
            const pricingCardRes = await getLandingPageSection('pricing_card');
            if (pricingCardRes?.content) {
                setPricingCard({
                    planName: pricingCardRes.content.planName || '',
                    badge: pricingCardRes.content.badge || '',
                    price: pricingCardRes.content.price || '',
                    points: pricingCardRes.content.points || ['', '', ''],
                });
            }

            // Fetch How It Works
            const howItWorksRes = await getLandingPageSection('how_it_works');
            if (howItWorksRes?.content) {
                setHowItWorks({
                    title: howItWorksRes.content.title || '',
                    subtitle: howItWorksRes.content.subtitle || '',
                });
            }

            // Fetch Map Section
            const mapSectionRes = await getLandingPageSection('map_section');
            if (mapSectionRes?.content) {
                setMapSection({
                    title: mapSectionRes.content.title || '',
                    points: mapSectionRes.content.points || ['', '', ''],
                });
            }

            // Fetch FAQ Header
            const faqHeaderRes = await getLandingPageSection('faq_header');
            if (faqHeaderRes?.content) {
                setFaqHeader({
                    mainTitle: faqHeaderRes.content.mainTitle || '',
                    mainSubtitle: faqHeaderRes.content.mainSubtitle || '',
                });
            }

            // Fetch Interview Questions Header
            const interviewRes = await getLandingPageSection('interview_questions_header');
            if (interviewRes?.content) {
                setInterviewQuestionsHeader({
                    title: interviewRes.content.title || '',
                    subtitle: interviewRes.content.subtitle || '',
                    description: interviewRes.content.description || '',
                });
            }

            // Fetch Sub Hero
            const subHeroRes = await getLandingPageSection('sub_hero');
            if (subHeroRes?.content) {
                setSubHero({
                    title: subHeroRes.content.title || '',
                    subtitle: subHeroRes.content.subtitle || '',
                });
            }

            // Fetch Coming Soon Header
            const comingSoonRes = await getLandingPageSection('coming_soon_header');
            if (comingSoonRes?.content) {
                setComingSoonHeader({
                    mainTitle: comingSoonRes.content.mainTitle || '',
                });
            }

            // Initial fetch for feature_1
            const feature1Res = await getLandingPageSection('feature_1');
            if (feature1Res?.content) {
                setFeatureData({
                    sectionId: 'feature_1',
                    title: feature1Res.content.title || '',
                    subtitle: feature1Res.content.subtitle || '',
                    points: feature1Res.content.points || ['', '', ''],
                });
            }

        } catch (error: any) {
            console.error("Failed to fetch landing page data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHeroContent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFeaturesHeader((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDataSkiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataSkies((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSqlSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSqlSection((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePricingHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPricingHeader((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePricingCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPricingCard((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleHowItWorksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHowItWorks((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMapSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMapSection((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFaqHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFaqHeader((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInterviewQuestionsHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInterviewQuestionsHeader((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSubHero((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleComingSoonHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setComingSoonHeader((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePricingCardPointChange = (index: number, value: string) => {
        const newPoints = [...pricingCard.points];
        newPoints[index] = value;
        setPricingCard((prev) => ({
            ...prev,
            points: newPoints,
        }));
    };

    const addPricingCardPoint = () => {
        setPricingCard((prev) => ({
            ...prev,
            points: [...prev.points, ''],
        }));
    };

    const removePricingCardPoint = (index: number) => {
        if (pricingCard.points.length <= 1) return;
        const newPoints = pricingCard.points.filter((_, i) => i !== index);
        setPricingCard((prev) => ({
            ...prev,
            points: newPoints,
        }));
    };

    const handleMapSectionPointChange = (index: number, value: string) => {
        const newPoints = [...mapSection.points];
        newPoints[index] = value;
        setMapSection((prev) => ({
            ...prev,
            points: newPoints,
        }));
    };

    const addMapSectionPoint = () => {
        setMapSection((prev) => ({
            ...prev,
            points: [...prev.points, ''],
        }));
    };

    const removeMapSectionPoint = (index: number) => {
        if (mapSection.points.length <= 1) return;
        const newPoints = mapSection.points.filter((_, i) => i !== index);
        setMapSection((prev) => ({
            ...prev,
            points: newPoints,
        }));
    };

    const handleFeatureChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFeatureData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'sectionId') {
            setFeatureLoading(true);
            try {
                const res = await getLandingPageSection(value);
                if (res?.content) {
                    setFeatureData({
                        sectionId: value,
                        title: res.content.title || '',
                        subtitle: res.content.subtitle || '',
                        points: res.content.points || ['', '', ''],
                    });
                } else {
                    // Reset if no content
                    setFeatureData({
                        sectionId: value,
                        title: '',
                        subtitle: '',
                        points: ['', '', ''],
                    });
                }
            } catch (error) {
                console.error(`Failed to fetch data for ${value}`, error);
            } finally {
                setFeatureLoading(false);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedVideo(e.target.files[0]);
        }
    };

    const handlePointChange = (index: number, value: string) => {
        const newPoints = [...featureData.points];
        newPoints[index] = value;
        setFeatureData((prev) => ({
            ...prev,
            points: newPoints,
        }));
    };

    const addPoint = () => {
        setFeatureData((prev) => ({
            ...prev,
            points: [...prev.points, ''],
        }));
    };

    const removePoint = (index: number) => {
        if (featureData.points.length <= 1) return;
        const newPoints = featureData.points.filter((_, i) => i !== index);
        setFeatureData((prev) => ({
            ...prev,
            points: newPoints,
        }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            const payload = {
                content: {
                    badgeText: heroContent.badgeText,
                    mainHeading: heroContent.mainHeading,
                },
            };
            await updateHeroSection(payload);
            toast({
                title: "Success",
                description: "Hero section updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update hero section",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleHeaderUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setHeaderLoading(true);
        try {
            const payload = {
                content: featuresHeader
            };
            await updateFeaturesHeader(payload);
            toast({
                title: "Success",
                description: "Features Header updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update features header",
                variant: "destructive",
            });
        } finally {
            setHeaderLoading(false);
        }
    };

    const handleDataSkiesUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setDataSkiesLoading(true);
        try {
            const payload = {
                content: dataSkies
            };
            await updateDataSkies(payload);
            toast({
                title: "Success",
                description: "Data Skies updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update Data Skies",
                variant: "destructive",
            });
        } finally {
            setDataSkiesLoading(false);
        }
    };

    const handleSqlSectionUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setSqlSectionLoading(true);
        try {
            const payload = {
                content: sqlSection
            };
            await updateSqlSection(payload);
            toast({
                title: "Success",
                description: "SQL Section updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update SQL Section",
                variant: "destructive",
            });
        } finally {
            setSqlSectionLoading(false);
        }
    };

    const handlePricingHeaderUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setPricingHeaderLoading(true);
        try {
            const payload = {
                content: pricingHeader
            };
            await updatePricingHeader(payload);
            toast({
                title: "Success",
                description: "Pricing Header updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update Pricing Header",
                variant: "destructive",
            });
        } finally {
            setPricingHeaderLoading(false);
        }
    };

    const handlePricingCardUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setPricingCardLoading(true);
        try {
            const cleanedPayload = {
                content: {
                    ...pricingCard,
                    points: pricingCard.points.filter(p => p.trim() !== '')
                }
            };
            await updatePricingCard(cleanedPayload);
            toast({
                title: "Success",
                description: "Pricing Card updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update Pricing Card",
                variant: "destructive",
            });
        } finally {
            setPricingCardLoading(false);
        }
    };

    const handleHowItWorksUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setHowItWorksLoading(true);
        try {
            const payload = {
                content: howItWorks
            };
            await updateHowItWorks(payload);
            toast({
                title: "Success",
                description: "How It Works section updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update How It Works section",
                variant: "destructive",
            });
        } finally {
            setHowItWorksLoading(false);
        }
    };

    const handleMapSectionUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setMapSectionLoading(true);
        try {
            const cleanedPayload = {
                content: {
                    ...mapSection,
                    points: mapSection.points.filter(p => p.trim() !== '')
                }
            };
            await updateMapSection(cleanedPayload);
            toast({
                title: "Success",
                description: "Map Section updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update Map Section",
                variant: "destructive",
            });
        } finally {
            setMapSectionLoading(false);
        }
    };

    const handleFaqHeaderUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setFaqHeaderLoading(true);
        try {
            const payload = {
                content: faqHeader
            };
            await updateFaqHeader(payload);
            toast({
                title: "Success",
                description: "FAQ Header updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update FAQ Header",
                variant: "destructive",
            });
        } finally {
            setFaqHeaderLoading(false);
        }
    };

    const handleInterviewQuestionsHeaderUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setInterviewQuestionsHeaderLoading(true);
        try {
            const payload = {
                content: interviewQuestionsHeader
            };
            await updateInterviewQuestionsHeader(payload);
            toast({
                title: "Success",
                description: "Interview Questions Header updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update Interview Questions Header",
                variant: "destructive",
            });
        } finally {
            setInterviewQuestionsHeaderLoading(false);
        }
    };

    const handleSubHeroUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubHeroLoading(true);
        try {
            const payload = {
                content: subHero
            };
            await updateSubHero(payload);
            toast({
                title: "Success",
                description: "Sub Hero updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update Sub Hero",
                variant: "destructive",
            });
        } finally {
            setSubHeroLoading(false);
        }
    };

    const handleComingSoonHeaderUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setComingSoonHeaderLoading(true);
        try {
            const payload = {
                content: comingSoonHeader
            };
            await updateComingSoonHeader(payload);
            toast({
                title: "Success",
                description: "Coming Soon Header updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update Coming Soon Header",
                variant: "destructive",
            });
        } finally {
            setComingSoonHeaderLoading(false);
        }
    };

    const handleFeatureUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setFeatureLoading(true);
        try {
            const { sectionId, ...content } = featureData;
            // Filter out empty points
            const cleanedContent = {
                ...content,
                points: content.points.filter(p => p.trim() !== '')
            };

            await updateFeatureWithVideo(sectionId, cleanedContent, selectedVideo || undefined);

            toast({
                title: "Success",
                description: `${sectionId} updated successfully with permanent database save!`,
            });
            // Reset video selection after success
            setSelectedVideo(null);
            const fileInput = document.getElementById('featureVideo') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update feature",
                variant: "destructive",
            });
        } finally {
            setFeatureLoading(false);
        }
    };

    return (
        <AdminLayout>
            <PageHeader
                title="Home Page Management"
                description="Update various sections of your landing page hero and content"
            />

            <div className="grid grid-cols-1 gap-8 mt-6">
                {/* Hero Section Management - Code remains same */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Hero Section</h2>
                            <p className="text-sm text-gray-500">Manage the top-most section of your home page</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="badgeText" className="text-sm font-medium">Badge Text</Label>
                                <Input
                                    id="badgeText"
                                    name="badgeText"
                                    placeholder="e.g. New Feature available!"
                                    value={heroContent.badgeText}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mainHeading" className="text-sm font-medium">Main Heading</Label>
                                <Input
                                    id="mainHeading"
                                    name="mainHeading"
                                    placeholder="e.g. Master Your Data Career"
                                    value={heroContent.mainHeading}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                                id="save-hero-changes"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Features Section Header Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Features Section Header</h2>
                            <p className="text-sm text-gray-500">Manage the main heading and subheading for the features area</p>
                        </div>
                    </div>

                    <form onSubmit={handleHeaderUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="headerTitle" className="text-sm font-medium">Header Title</Label>
                                <Input
                                    id="headerTitle"
                                    name="title"
                                    placeholder="e.g. Master Your Data Career"
                                    value={featuresHeader.title}
                                    onChange={handleHeaderChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={headerLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {headerLoading ? 'Saving...' : 'Save Header'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Feature Section Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Feature Section</h2>
                            <p className="text-sm text-gray-500">Manage individual feature items on your landing page</p>
                        </div>
                    </div>

                    <form onSubmit={handleFeatureUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="sectionId" className="text-sm font-medium">Feature ID</Label>
                                <select
                                    id="sectionId"
                                    name="sectionId"
                                    value={featureData.sectionId}
                                    onChange={handleFeatureChange}
                                    className="w-full p-2 border rounded-md cursor-pointer"
                                >
                                    <option value="feature_1">Feature 1</option>
                                    <option value="feature_2">Feature 2</option>
                                    <option value="feature_3">Feature 3</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Handpicked & curated #data jobs"
                                    value={featureData.title}
                                    onChange={handleFeatureChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="subtitle" className="text-sm font-medium">Subtitle</Label>
                                <Input
                                    id="subtitle"
                                    name="subtitle"
                                    placeholder="e.g. Don't waste time searching..."
                                    value={featureData.subtitle}
                                    onChange={handleFeatureChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="featureVideo" className="text-sm font-medium">Feature Video (optional)</Label>
                                <Input
                                    id="featureVideo"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                                {selectedVideo && (
                                    <p className="text-sm text-green-600">Selected: {selectedVideo.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Points Management */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Feature Points</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addPoint}
                                    className="text-xs cursor-pointer"
                                >
                                    + Add Point
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {featureData.points.map((point, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={point}
                                            onChange={(e) => handlePointChange(index, e.target.value)}
                                            placeholder={`Point ${index + 1}`}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePoint(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                            disabled={featureData.points.length <= 1}
                                        >
                                            <span className="text-lg">×</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t mt-6">
                            <Button
                                type="submit"
                                disabled={featureLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {featureLoading ? 'Saving...' : 'Save Feature'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Data Skies Section Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Data Skies Section</h2>
                            <p className="text-sm text-gray-500">Manage the Aussie Skies section headline</p>
                        </div>
                    </div>

                    <form onSubmit={handleDataSkiesUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="dataSkiesTitle" className="text-sm font-medium">Section Title</Label>
                                <Input
                                    id="dataSkiesTitle"
                                    name="title"
                                    placeholder="e.g. We curate every #data job under the Aussie skies"
                                    value={dataSkies.title}
                                    onChange={handleDataSkiesChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={dataSkiesLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {dataSkiesLoading ? 'Saving...' : 'Save Data Skies'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* SQL Section Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">SQL Section</h2>
                            <p className="text-sm text-gray-500">Manage the SQL Rockstar section content</p>
                        </div>
                    </div>

                    <form onSubmit={handleSqlSectionUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="sqlTitle" className="text-sm font-medium">Title</Label>
                                <Input
                                    id="sqlTitle"
                                    name="title"
                                    placeholder="e.g. SQL: your golden ticket..."
                                    value={sqlSection.title}
                                    onChange={handleSqlSectionChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sqlSubtitle" className="text-sm font-medium">Subtitle</Label>
                                <Input
                                    id="sqlSubtitle"
                                    name="subtitle"
                                    placeholder="e.g. Become a SQL rockstar..."
                                    value={sqlSection.subtitle}
                                    onChange={handleSqlSectionChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={sqlSectionLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {sqlSectionLoading ? 'Saving...' : 'Save SQL Section'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Pricing Header Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Pricing Header</h2>
                            <p className="text-sm text-gray-500">Manage the headline and subtitle of the pricing section</p>
                        </div>
                    </div>

                    <form onSubmit={handlePricingHeaderUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="pricingMainTitle" className="text-sm font-medium">Main Title</Label>
                                <Input
                                    id="pricingMainTitle"
                                    name="mainTitle"
                                    placeholder="e.g. Hack your way to a new data job."
                                    value={pricingHeader.mainTitle}
                                    onChange={handlePricingHeaderChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pricingMainSubtitle" className="text-sm font-medium">Main Subtitle</Label>
                                <Input
                                    id="pricingMainSubtitle"
                                    name="mainSubtitle"
                                    placeholder="e.g. Choose the best plan to fit your needs."
                                    value={pricingHeader.mainSubtitle}
                                    onChange={handlePricingHeaderChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={pricingHeaderLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {pricingHeaderLoading ? 'Saving...' : 'Save Pricing Header'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Pricing Card Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Pricing Card</h2>
                            <p className="text-sm text-gray-500">Manage the details of your main pricing plan</p>
                        </div>
                    </div>

                    <form onSubmit={handlePricingCardUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="planName" className="text-sm font-medium">Plan Name</Label>
                                <Input
                                    id="planName"
                                    name="planName"
                                    placeholder="e.g. Pro"
                                    value={pricingCard.planName}
                                    onChange={handlePricingCardChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="badge" className="text-sm font-medium">Badge (Optional)</Label>
                                <Input
                                    id="badge"
                                    name="badge"
                                    placeholder="e.g. Most popular"
                                    value={pricingCard.badge}
                                    onChange={handlePricingCardChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    placeholder="e.g. AUD 4.90 / month"
                                    value={pricingCard.price}
                                    onChange={handlePricingCardChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Plan Points Management */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Plan Inclusions</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addPricingCardPoint}
                                    className="text-xs cursor-pointer"
                                >
                                    + Add Point
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {pricingCard.points.map((point, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={point}
                                            onChange={(e) => handlePricingCardPointChange(index, e.target.value)}
                                            placeholder={`Point ${index + 1}`}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePricingCardPoint(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                            disabled={pricingCard.points.length <= 1}
                                        >
                                            <span className="text-lg">×</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={pricingCardLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {pricingCardLoading ? 'Saving...' : 'Save Pricing Card'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* How It Works Section Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">How It Works Section</h2>
                            <p className="text-sm text-gray-500">Manage the headline and subtitle of the How It Works section</p>
                        </div>
                    </div>

                    <form onSubmit={handleHowItWorksUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="howTitle" className="text-sm font-medium">Title</Label>
                                <Input
                                    id="howTitle"
                                    name="title"
                                    placeholder="e.g. How it works"
                                    value={howItWorks.title}
                                    onChange={handleHowItWorksChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="howSubtitle" className="text-sm font-medium">Subtitle</Label>
                                <Input
                                    id="howSubtitle"
                                    name="subtitle"
                                    placeholder="e.g. Three steps to accelerate..."
                                    value={howItWorks.subtitle}
                                    onChange={handleHowItWorksChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={howItWorksLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {howItWorksLoading ? 'Saving...' : 'Save Section'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Map Section Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Map Section</h2>
                            <p className="text-sm text-gray-500">Manage the toolkit title and features list</p>
                        </div>
                    </div>

                    <form onSubmit={handleMapSectionUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="mapTitle" className="text-sm font-medium">Section Title</Label>
                                <Input
                                    id="mapTitle"
                                    name="title"
                                    placeholder="e.g. Your all-in-one data career toolkit."
                                    value={mapSection.title}
                                    onChange={handleMapSectionChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Map Points Management */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Toolkit Features</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addMapSectionPoint}
                                    className="text-xs"
                                >
                                    + Add Feature
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {mapSection.points.map((point, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={point}
                                            onChange={(e) => handleMapSectionPointChange(index, e.target.value)}
                                            placeholder={`Feature ${index + 1}`}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeMapSectionPoint(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            disabled={mapSection.points.length <= 1}
                                        >
                                            <span className="text-lg">×</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={mapSectionLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {mapSectionLoading ? 'Saving...' : 'Save Map Section'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* FAQ Header Section Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">FAQ Header</h2>
                            <p className="text-sm text-gray-500">Manage the headline and subtitle of the FAQ section</p>
                        </div>
                    </div>

                    <form onSubmit={handleFaqHeaderUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="faqMainTitle" className="text-sm font-medium">Main Title</Label>
                                <Input
                                    id="faqMainTitle"
                                    name="mainTitle"
                                    placeholder="e.g. Frequently asked questions"
                                    value={faqHeader.mainTitle}
                                    onChange={handleFaqHeaderChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="faqMainSubtitle" className="text-sm font-medium">Main Subtitle</Label>
                                <Input
                                    id="faqMainSubtitle"
                                    name="mainSubtitle"
                                    placeholder="e.g. Answers to common questions..."
                                    value={faqHeader.mainSubtitle}
                                    onChange={handleFaqHeaderChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={faqHeaderLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {faqHeaderLoading ? 'Saving...' : 'Save FAQ Header'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Interview Questions Header Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Interview Questions Header</h2>
                            <p className="text-sm text-gray-500">Manage the title, subtitle, and description for the Interview Questions section</p>
                        </div>
                    </div>

                    <form onSubmit={handleInterviewQuestionsHeaderUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="interviewTitle" className="text-sm font-medium">Title</Label>
                                <Input
                                    id="interviewTitle"
                                    name="title"
                                    placeholder="e.g. Your Path to SQL & Data Science Success"
                                    value={interviewQuestionsHeader.title}
                                    onChange={handleInterviewQuestionsHeaderChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="interviewSubtitle" className="text-sm font-medium">Subtitle</Label>
                                <Input
                                    id="interviewSubtitle"
                                    name="subtitle"
                                    placeholder="e.g. Explore curated SQL and Data Science..."
                                    value={interviewQuestionsHeader.subtitle}
                                    onChange={handleInterviewQuestionsHeaderChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="interviewDescription" className="text-sm font-medium">Description</Label>
                                <Input
                                    id="interviewDescription"
                                    name="description"
                                    placeholder="e.g. From the creators of DataCareer..."
                                    value={interviewQuestionsHeader.description}
                                    onChange={handleInterviewQuestionsHeaderChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={interviewQuestionsHeaderLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {interviewQuestionsHeaderLoading ? 'Saving...' : 'Save Interview Header'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sub Hero Section Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Sub Hero Section</h2>
                            <p className="text-sm text-gray-500">Manage the "Master SQL" section title and subtitle</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubHeroUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="subHeroTitle" className="text-sm font-medium">Title</Label>
                                <Input
                                    id="subHeroTitle"
                                    name="title"
                                    placeholder="e.g. Master SQL for Data Jobs"
                                    value={subHero.title}
                                    onChange={handleSubHeroChange}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subHeroSubtitle" className="text-sm font-medium">Subtitle</Label>
                                <Input
                                    id="subHeroSubtitle"
                                    name="subtitle"
                                    placeholder="e.g. Learn SQL through real-world simulations..."
                                    value={subHero.subtitle}
                                    onChange={handleSubHeroChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={subHeroLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {subHeroLoading ? 'Saving...' : 'Save Sub Hero'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Coming Soon Header Management */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Coming Soon Header</h2>
                            <p className="text-sm text-gray-500">Manage the 'More Tools Coming Soon' header text</p>
                        </div>
                    </div>

                    <form onSubmit={handleComingSoonHeaderUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="comingSoonMainTitle" className="text-sm font-medium">Main Title</Label>
                                <Input
                                    id="comingSoonMainTitle"
                                    name="mainTitle"
                                    placeholder="e.g. More Tools Coming Soon"
                                    value={comingSoonHeader.mainTitle}
                                    onChange={handleComingSoonHeaderChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={comingSoonHeaderLoading}
                                className="bg-primary hover:bg-primary-dark text-white px-8 transition-colors"
                            >
                                {comingSoonHeaderLoading ? 'Saving...' : 'Save Header'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Placeholder for future sections */}
                <div className="data-card p-6 border rounded-lg bg-white shadow-sm opacity-60">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Other Sections</h2>
                            <p className="text-sm text-gray-500">Coming soon: Manage Pricing, Testimonials, and more.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default LandingPage;
