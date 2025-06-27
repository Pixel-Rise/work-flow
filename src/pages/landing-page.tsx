import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/use-language";
import { 
  Users, 
  Target, 
  Zap, 
  Shield, 
  Globe, 
  CheckCircle,
  Briefcase,
  Mail,
  Phone
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  // Project features for the work management system
  const projectFeatures = [
    {
      title: t("time_tracking") || "Vaqt Hisobi",
      description: t("time_tracking_desc") || "Ish vaqtlarini aniq hisoblab borish va nazorat qilish",
      icon: <Users className="h-12 w-12" />,
      benefits: [
        t("accurate_time_tracking") || "Aniq vaqt hisobi", 
        t("salary_calculation") || "Mehnat haqi hisoblash", 
        t("work_efficiency") || "Ish samaradorligi"
      ]
    },
    {
      title: t("project_management") || "Loyiha Boshqaruvi", 
      description: t("project_management_desc") || "Loyihalarni samarali boshqarish va kuzatish",
      icon: <Target className="h-12 w-12" />,
      benefits: [
        t("task_distribution") || "Vazifalar taqsimi", 
        t("deadline_control") || "Muddatlar nazorati", 
        t("results_analysis") || "Natijalar tahlili"
      ]
    },
    {
      title: t("team_collaboration") || "Jamoaviy Hamkorlik",
      description: t("team_collaboration_desc") || "Jamoa a'zolari o'rtasida samarali hamkorlik",
      icon: <Zap className="h-12 w-12" />,
      benefits: [
        t("chat_system") || "Chat tizimi", 
        t("file_sharing") || "Fayl almashish", 
        t("collaborative_work") || "Birgalikda ishlash"
      ]
    },
    {
      title: t("reports_analytics") || "Hisobot va Tahlil",
      description: t("reports_analytics_desc") || "Detektiv hisobotlar va ishlash ko'rsatkichlari",
      icon: <CheckCircle className="h-12 w-12" />,
      benefits: [
        t("daily_reports") || "Kunlik hisobotlar", 
        t("statistics") || "Statistika", 
        t("performance_analysis") || "Performance tahlili"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Users className="h-8 w-8" />,
      title: t("team_collaboration") || "Jamoaviy Hamkorlik",
      description: t("real_time_collaboration") || "Real vaqtda jamoaviy ishlash va kommunikatsiya"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: t("clear_goals") || "Aniq Maqsadlar", 
      description: t("clear_goals_desc") || "Har bir vazifa va loyiha uchun aniq maqsadlar"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t("fast_efficient") || "Tez va Samarali",
      description: t("fast_efficient_desc") || "Zamonaviy texnologiyalar bilan tez natijalar"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t("data_security") || "Ma'lumot Xavfsizligi",
      description: t("data_security_desc") || "Ishchi ma'lumotlari to'liq himoyalangan"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t("remote_work") || "Masofaviy Ishlash",
      description: t("remote_work_desc") || "Istalgan joydan ishlash imkoniyati"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: t("guaranteed_results") || "Natija Kafolati",
      description: t("guaranteed_results_desc") || "Ish samaradorligini oshirish kafolatlanadi"
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="w-full max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs px-3 py-1">
            {t("work_management_system") || "Ish Boshqaruv Tizimi"}
          </Badge>
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight px-2">
            {t("workflow_dashboard") || "WorkFlow Dashboard"}
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground mb-5 sm:mb-6 md:mb-8 max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl mx-auto px-3 leading-relaxed">
            {t("landing_hero_description") || "Jamoaviy ish muhitini yaxshi taminlash va ish vaqtlarini aniq hisoblab borish uchun mo'ljallangan zamonaviy boshqaruv tizimi."}
          </p>
          <div className="flex flex-col gap-3 justify-center items-center w-full max-w-xs xs:max-w-sm sm:max-w-none mx-auto px-3 sm:px-0 sm:flex-row sm:gap-4">
            <Button size="lg" onClick={() => navigate("/login")} className="w-full sm:w-auto text-sm sm:text-base">
              <Briefcase className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {t("enter_system") || "Tizimga kirish"}
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
              <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {t("view_demo") || "Demo ko'rish"}
            </Button>
          </div>
        </div>
      </section>

      {/* Project Features Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 px-3">
              {t("main_features") || "Asosiy Imkoniyatlar"}
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-muted-foreground max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl mx-auto px-3 leading-relaxed">
              {t("main_features_desc") || "Ish jarayonlarini samarali boshqarish va ish vaqtlarini aniq hisoblab borish uchun mo'ljallangan keng imkoniyatlar."}
            </p>
          </div>
          
          {/* Features Mobile Cards */}
          <div className="block sm:hidden space-y-4 px-3">
            {projectFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 w-full">
                <CardHeader className="pb-3">
                  <div className="mx-auto mb-3 p-3 bg-primary/10 rounded-full w-fit text-primary">
                    {React.cloneElement(feature.icon, { className: "h-6 w-6" })}
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="space-y-1.5">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-left">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="text-xs">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Carousel for larger screens */}
          <div className="hidden sm:block relative">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent className="-ml-2 md:-ml-4">
                {projectFeatures.map((feature, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2">
                    <Card className="text-center hover:shadow-lg transition-all duration-300 transform h-full">
                      <CardHeader className="pb-4">
                        <div className="mx-auto mb-3 sm:mb-4 p-3 sm:p-4 bg-primary/10 rounded-full w-fit text-primary">
                          {React.cloneElement(feature.icon, { className: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" })}
                        </div>
                        <CardTitle className="text-lg sm:text-xl transition-colors duration-300 hover:text-primary">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {feature.description}
                        </p>
                        <div className="space-y-2">
                          {feature.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center justify-center gap-2">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-center">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            {/* Navigation Hint */}
            <div className="text-center mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm text-muted-foreground px-2">
                {t("navigation_hint") || "← → tugmalar yoki sichqoncha bilan harakatlantiring"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 px-3">
              {t("why_workflow_dashboard") || "Nima uchun WorkFlow Dashboard?"}
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-muted-foreground max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl mx-auto px-3 leading-relaxed">
              {t("why_workflow_dashboard_desc") || "Bizning tizimimiz ish jarayonlarini osonlashtiradi va jamoaviy samaradorlikni sezilarli darajada oshiradi."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-3 sm:px-0">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow w-full">
                <CardHeader className="pb-3 px-3 sm:px-4">
                  <div className="mx-auto mb-2 sm:mb-3 p-2 bg-primary/10 rounded-full w-fit text-primary">
                    {React.cloneElement(benefit.icon, { className: "h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" })}
                  </div>
                  <CardTitle className="text-sm xs:text-base sm:text-lg md:text-xl leading-tight">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 pb-4">
                  <p className="text-xs xs:text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 text-center">
            <div className="p-3 sm:p-4 bg-background/50 rounded-lg">
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">99.9%</div>
              <div className="text-xs text-muted-foreground px-1 leading-tight">
                {t("system_uptime") || "Tizim ishlash vaqti"}
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-background/50 rounded-lg">
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">45%</div>
              <div className="text-xs text-muted-foreground px-1 leading-tight">
                {t("efficiency_increase") || "Ish samaradorligi oshishi"}
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-background/50 rounded-lg">
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">24/7</div>
              <div className="text-xs text-muted-foreground px-1 leading-tight">
                {t("technical_support") || "Texnik yordam"}
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-background/50 rounded-lg">
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">30s</div>
              <div className="text-xs text-muted-foreground px-1 leading-tight">
                {t("average_response_time") || "O'rtacha javob vaqti"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4">
        <div className="w-full max-w-7xl mx-auto text-center">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 px-3">
            {t("try_system") || "Tizimni sinab ko'ring"}
          </h2>
          <p className="text-xs xs:text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 md:mb-8 max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl mx-auto px-3 leading-relaxed">
            {t("try_system_desc") || "WorkFlow Dashboard bilan tanishish uchun demo versiyani sinab ko'ring yoki texnik yordam uchun biz bilan bog'laning."}
          </p>
          <div className="flex flex-col gap-3 justify-center items-center w-full max-w-xs xs:max-w-sm sm:max-w-none mx-auto px-3 sm:px-0 sm:flex-row sm:gap-4">
            <Button size="lg" onClick={() => navigate("/login")} className="w-full sm:w-auto text-sm sm:text-base">
              <Phone className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {t("free_trial") || "Bepul sinab ko'rish"}
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
              <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {t("need_help") || "Yordam kerak"}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 border-t bg-muted/30">
        <div className="w-full max-w-7xl mx-auto text-center text-xs text-muted-foreground">
          <p className="px-2 leading-relaxed">
            &copy; 2025 {t("workflow_dashboard") || "WorkFlow Dashboard"}. {t("footer_tagline") || "Jamoaviy ish samaradorligi uchun yaratilgan."}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
