import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/greeting-cards.css'

const staticImages = [
  {
    id: "vertical",
    category: "بطاقات رأسية",
    images: [
      { id: "V1", src: "../public/images/vertical/V1.jpg", label: "بطاقة رأسية 1" },
      { id: "V2", src: "/معايدة/GreetingCards - Create Card_files/V2.jpg", label: "بطاقة رأسية 2" },
      { id: "V3", src: "/معايدة/GreetingCards - Create Card_files/V3.jpg", label: "بطاقة رأسية 3" },
      // ...add all your vertical images
    ]
  },
  {
    id: "horizontal",
    category: "بطاقات أفقية",
    images: [
      { id: "H1", src: "/معايدة/GreetingCards - Create Card_files/H1.jpg", label: "بطاقة أفقية 1" },
      { id: "H2", src: "/معايدة/GreetingCards - Create Card_files/H2.jpg", label: "بطاقة أفقية 2" },
      { id: "H3", src: "/معايدة/GreetingCards - Create Card_files/H3.jpg", label: "بطاقة أفقية 3" },
      // ...add all your horizontal images
    ]
  }
];

createRoot(document.getElementById("root")!).render(<App />);
