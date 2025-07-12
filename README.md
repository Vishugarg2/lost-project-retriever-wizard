# EcoSwap - Sustainable Shopping App

## 🌱 Walmart Hackathon Project

EcoSwap is a comprehensive sustainable shopping application built for the Walmart Hackathon. It helps users make eco-friendly purchasing decisions by providing real-time environmental impact data, alternative product suggestions, and gamified sustainability features.

## 🚀 Key Features

### 🛍️ Smart Shopping
- **Product Scanning**: Use both rear and front camera to scan product barcodes
- **Carbon Footprint Analysis**: Real-time calculation of environmental impact
- **Eco-Friendly Alternatives**: AI-powered suggestions for greener products
- **Price Comparison**: Compare costs while considering environmental impact

### 🤖 EcoBot Assistant
- **Voice Integration**: Complete voice commands and responses
- **Microphone Support**: Tap-to-speak functionality
- **Smart Recommendations**: Personalized eco-friendly suggestions
- **Real-time Help**: 24/7 sustainable shopping guidance

### 💳 Indian Payment Integration
- **Multiple Payment Options**: PhonePe, Google Pay, Paytm, UPI
- **Credit/Debit Cards**: Full card payment support
- **INR Currency**: All prices displayed in Indian Rupees (₹)
- **Secure Transactions**: Encrypted payment processing

### 📊 Sustainability Tracking
- **Eco Points System**: Gamified rewards for green choices
- **CO₂ Savings Tracker**: Monitor your environmental impact
- **Monthly Goals**: Set and achieve sustainability targets
- **Community Impact**: See collective community progress

### 🗃️ Backend Integration (Supabase)
- **User Authentication**: Secure signup/login system
- **Real-time Database**: Store user data, products, and transactions
- **Cart Management**: Persistent shopping cart across sessions
- **Message History**: Save EcoBot conversations
- **Product Database**: Comprehensive eco-friendly product catalog

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI with custom design system
- **Mobile**: Capacitor for native camera access
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Payments**: Mock Indian payment gateway integration
- **Voice**: Web Speech API for voice commands
- **Camera**: Capacitor Camera Plugin

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (optional - works with mock data)

### Installation
```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Supabase Setup (Optional)
1. Create a Supabase project
2. Update `src/lib/supabase.ts` with your credentials
3. Create the required database tables
4. Enable authentication in Supabase dashboard

### Mobile Development
```sh
# Add Capacitor platforms
npx cap add ios android

# Build the project
npm run build

# Sync with native platforms
npx cap sync

# Run on device
npx cap run ios
# or
npx cap run android
```

## 📱 Mobile Features

- **Native Camera Access**: Both front and rear camera support
- **Barcode Scanning**: Real-time product recognition
- **Voice Commands**: Full speech-to-text integration
- **Push Notifications**: Eco-friendly reminders
- **Offline Support**: Works without internet connection

## 🎯 Hackathon Highlights

### Innovation
- **Dual Camera Scanning**: Unique front camera mode for personal items
- **Voice-First AI**: Complete voice interaction with EcoBot
- **Indian Market Focus**: Localized payment methods and currency
- **Gamification**: Points and achievements for sustainable choices

### User Experience
- **Seamless Onboarding**: Multiple welcome notifications
- **Real-time Feedback**: Instant carbon footprint calculation
- **Community Impact**: Show collective environmental savings
- **Progressive Enhancement**: Works on web and mobile

## 🔮 Future Roadmap

- **AI Product Recognition**: Advanced barcode-less scanning
- **Social Features**: Share eco-achievements with friends
- **Local Store Integration**: Real-time inventory from nearby stores
- **Blockchain Rewards**: NFT certificates for sustainability milestones

---

**Built with ❤️ for a sustainable future** 🌍

### Original Lovable Project
**URL**: https://lovable.dev/projects/cae2d0fe-60f3-4c52-9704-fbd26cc9dcd9
