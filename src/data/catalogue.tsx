import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

export default {
  heading: "heading",
  description: "description",
  ctaLabel: "Add Your Preschool",
  perSchoolList: [
    {
      title: "All Stars Kindergarten",
      image: "/preschool/image2.jpg",
      location: "Pargue",
    },
    {
      title: "All Stars Kindergarten",
      image: "/preschool/image1.jpg",
      location: "Pargue",
    },
    {
      title: "Malvína Preschool – Prague",
      image: "/preschool/image3.jpg",
      location: "Pargue",
    },
    {
      title: "Dragon Kindergartens",
      image: "/preschool/image4.jpg",
      location: "Pargue",
    },
    {
      title: "Dragon Kindergartens",
      image: "/preschool/image5.jpg",
      location: "Pargue",
    },
  ],
  features: [
    {
      icon: <EmojiEventsIcon fontSize="large" color="secondary" />,
      title: "Thousands of Parents Visit Every Month",
      description:
        "Parents actively searching for kindergartens in their local area land on our platform daily. We specialize in early childhood education, giving you a direct line to your ideal audience.",
    },
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: "Designed to Rank — Built to Find You",
      description:
        'Most parents search by location, not by school name. Our platform is optimized to show listings like yours when they search for terms like "kindergartens Prague" or "private preschool Brno."',
    },
    {
      icon: <PublicIcon fontSize="large" color="success" />,
      title: "One Listing = Multiple Portals",
      description:
        "When you join, your preschool gets promoted across several specialized websites. Whether you offer Montessori education or outdoor learning, we’ve got you covered.",
    },
    {
      icon: <TrendingUpIcon fontSize="large" color="error" />,
      title: "A Smart Investment in Growth",
      description:
        "Even a single new family enrolling through our platform could cover your listing cost for the year. We’ve kept our pricing accessible, so you can focus on growing your preschool.",
    },
    {
      icon: <LightbulbIcon fontSize="large" color="warning" />,
      title: "Designed to Rank — Built to Find You",
      description:
        'Most parents search by location, not by school name. Our platform is optimized to show listings like yours when they search for terms like "kindergartens Prague" or "private preschool Brno."',
    },
  ],
  portalsOffered: {
    image: "/catalogue/portalsOffered.jpg",
    lists: [
      "Private Kindergartens",
      "Language Preschools",
      "Forest Schools",
      "Art-focused Kindergartens",
    ],
  },
  ourPricing: {
    plans: [
      {
        name: "Basic",
        description: "Catalog listing with basic profile features",
        price: "0 Kč",
        features: [
          { label: "Listing in Catalog", included: true },
          { label: "Basic Profile", included: true },
          { label: "Unlimited profile edits", included: true },
          { label: "Direct parent contact", included: true },
          { label: "Detailed Profile", included: false },
          { label: "Community Partner Badge", included: false },
          { label: "Visitor Statistics", included: false },
          { label: "Homepage Featured Promotion", included: false },
        ],
      },
      {
        name: "Premium",
        description: "Premium listing with detailed profile and features",
        price: "199 Kč",
        popular: true,
        features: [
          { label: "Listing in Catalog", included: true },
          { label: "Basic Profile", included: true },
          { label: "Unlimited profile edits", included: true },
          { label: "Direct parent contact", included: true },
          { label: "Detailed Profile", included: true },
          { label: "Community Partner Badge", included: true },
          { label: "Visitor Statistics", included: true },
          { label: "Homepage Featured Promotion", included: true },
        ],
      },
    ],
  },
};
