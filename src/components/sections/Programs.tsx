import { ModernPricingPage } from "../ui/animated-glassy-pricing";

export default function Programs() {
  const pricingPlans = [
    {
      planName: "Teacher Workshop",
      description: "Empowering educators with culturally responsive pedagogy.",
      price: "₦25,000",
      features: [
        "Full-day intensive workshop",
        "Lumina Educator Certificate",
        "Access to Lumina educator community",
        "Modern storytelling techniques"
      ],
      buttonText: "Register Now",
      buttonVariant: "secondary" as const,
      href: "https://forms.gle/mp8JQCxRMCcEx5SJA",
    },
    {
      planName: "StoryBridges Kit",
      description: "A complete culturally immersive reading kit for your classroom.",
      price: "₦45,000",
      isPopular: true,
      features: [
        "20 curated African storybooks",
        "AR-enabled interactive flashcards",
        "Teacher implementation guide",
        "1-term dedicated support"
      ],
      buttonText: "Get the Kit",
      buttonVariant: "primary" as const,
      onClick: () => window.dispatchEvent(new CustomEvent('show-story-bridges')),
    },
    {
      planName: "School Adoption",
      description: "Transform your school's entire literacy framework.",
      price: "₦350,000",
      features: [
        "School-wide reading assessment",
        "Customized literacy curriculum",
        "Full staff training (up to 20)",
        "Library stocking & setup",
        "Year-round monitoring & reporting"
      ],
      buttonText: "Partner With Us",
      buttonVariant: "secondary" as const,
      onClick: () => window.dispatchEvent(new CustomEvent('show-school-adoption')),
    },
    {
      planName: "Summer Reading",
      description: "Engage students over the break with our specialized reading camp.",
      price: "₦15,000",
      features: [
        "Interactive reading sessions",
        "Weekly reading challenges",
        "Reading comprehension exercises",
        "Certificate of completion"
      ],
      buttonText: "Join Camp",
      buttonVariant: "secondary" as const,
      href: "https://docs.google.com/forms/d/e/1FAIpQLSfgVmvDLwjk1xi60wWsZaxtuqwiKcrqpYT5CHvQrxj4LhT0sg/viewform?usp=publish-editor",
    }
  ];

  return (
    <ModernPricingPage
      title="Invest in African Excellence"
      subtitle="Choose the intervention level that fits your scale. Every program is designed to deliver measurable literacy outcomes."
      plans={pricingPlans}
      showAnimatedBackground={true}
    />
  );
}
