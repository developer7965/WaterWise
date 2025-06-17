
import type { LucideIcon } from 'lucide-react';
import { 
  Droplet, ShowerHead, WashingMachine, Pipette, Lightbulb, Trophy, TreePine, CloudRain, ChefHat, Recycle, Thermometer, 
  Droplets, BarChart3, User, Settings, Users, Car, Bath, CookingPot, Snowflake, Gauge, Sparkles, PenToolIcon,
  Award, Star, HelpCircle, TrendingUp, DollarSign, Target, Sun, Info // Added Info
} from 'lucide-react';

export const challengeIconsMap = {
  ShowerHead, Pipette, Droplet, WashingMachine, CloudRain, ChefHat, Recycle, Thermometer, Droplets, TreePine,
  Lightbulb, Trophy, BarChart3, User, Settings, Users, Car, Bath, CookingPot, Snowflake, Gauge, Sparkles, PenToolIcon,
  Award, Star, HelpCircle, TrendingUp, DollarSign, Target, Sun, Info // Added Info here as well
} as const;

export type ChallengeIconName = keyof typeof challengeIconsMap;

export interface Tip {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'Bathroom' | 'Kitchen' | 'Outdoor' | 'General';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  iconName: ChallengeIconName;
  points: number;
}

export interface UserProfileData {
  uid?: string; 
  name: string;
  email?: string; 
  waterSavedThisMonthLiters: number; 
  moneySavedThisMonth: number; 
  challengesCompleted: number; 
  currentStreakDays: number; 
  totalPoints: number; 
}

export interface WaterUsageLog {
  id: string;
  date: string; 
  source: 'Shower' | 'Laundry' | 'Tap' | 'Dishwasher' | 'Toilet' | 'Outdoor' | 'Other';
  liters: number;
  durationMinutes?: number; 
  notes?: string;
}

export const sampleTips: Tip[] = [
  { id: 'tip1', title: 'Fix Leaks Promptly', description: 'A small drip can waste over 20 gallons of water a day. Check faucets and pipes regularly.', icon: Pipette, category: 'General' },
  { id: 'tip2', title: 'Shorter Showers', description: 'Aim for 5-minute showers. Each minute saved can conserve up to 5 gallons of water.', icon: ShowerHead, category: 'Bathroom' },
  { id: 'tip3', title: 'Full Laundry Loads', description: 'Only run your washing machine and dishwasher with full loads to maximize water efficiency.', icon: WashingMachine, category: 'General' },
  { id: 'tip4', title: 'Turn Off Tap When Brushing', description: 'Don\'t let water run while brushing your teeth. This can save up to 4 gallons per minute.', icon: Pipette, category: 'Bathroom' },
  { id: 'tip5', title: 'Use a Bowl for Rinsing Vegetables', description: 'Instead of letting the tap run, rinse fruits and vegetables in a bowl of water.', icon: Pipette, category: 'Kitchen' },
  { id: 'tip6', title: 'Water Plants in Early Morning', description: 'Water your garden during the cooler parts of the day to reduce evaporation.', icon: TreePine, category: 'Outdoor' },
];

export const sampleChallenges: Challenge[] = [
  { id: 'ch1', title: '2-Minute Shower Week', description: 'Challenge yourself to take showers that are 2 minutes or less for an entire week.', duration: '1 Week', difficulty: 'Hard', iconName: 'ShowerHead', points: 100 },
  { id: 'ch2', title: 'No-Leak Detective', description: 'Inspect all faucets, toilets, and pipes in your home for leaks and fix any you find.', duration: '3 Days', difficulty: 'Medium', iconName: 'Pipette', points: 75 },
  { id: 'ch3', title: 'Meatless Monday Watersaver', description: 'Go meatless for one day. Producing meat requires significantly more water than plant-based foods.', duration: '1 Day', difficulty: 'Easy', iconName: 'Droplet', points: 50 },
];

export const sampleUserProfile: UserProfileData = {
  name: 'User Profile Stats Base',
  email: 'stats.base@example.com',
  waterSavedThisMonthLiters: 0, 
  moneySavedThisMonth: 0, 
  challengesCompleted: 0,
  currentStreakDays: 0, 
  totalPoints: 0,
};


export const averageWeeklyUsageLiters = 350;

export const waterSourcesIcons = {
  Shower: ShowerHead,
  Laundry: WashingMachine,
  Tap: Pipette,
  Dishwasher: Droplet,
  Toilet: Droplet,
  Outdoor: TreePine,
  Other: Lightbulb,
};

export const initialWaterUsageData: WaterUsageLog[] = [];

export interface ProfileStatsForBadges extends UserProfileData {
  aiChallengesCompleted: number;
  easyChallengesCompleted: number;
  mediumChallengesCompleted: number;
  hardChallengesCompleted: number;
  logsCount: number;
}

export interface AchievementBadgeDefinition {
  id: string;
  name: string;
  description: string;
  criteria: (stats: ProfileStatsForBadges) => boolean;
  achievedClasses: string;
  unachievedClasses: string;
  icon: LucideIcon;
  isSecret?: boolean; 
  secretName?: string;
  secretDescription?: string;
  secretIcon?: LucideIcon;
}

const achievedBadgeBaseClasses = 'shadow-lg hover:opacity-95 transform hover:scale-105 transition-all duration-200 ease-in-out';
const regularAchievedClasses = `${achievedBadgeBaseClasses} bg-gradient-to-br from-teal-400 to-blue-500 text-white border-teal-500/50 shadow-cyan-500/50 glow-blue-green`;
const superAchievedClasses = `${achievedBadgeBaseClasses} bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white border-orange-500/50 shadow-orange-500/70 animate-pulse glow-orange`;
const unachievedClasses = 'bg-muted text-muted-foreground border-border filter grayscale opacity-70 hover:bg-muted/80';


const regularBadges: AchievementBadgeDefinition[] = [
  {
    id: 'log_1', name: 'First Log', description: 'Log your first water usage activity.',
    criteria: (stats) => stats.logsCount >= 1,
    icon: Droplet, achievedClasses: regularAchievedClasses, 
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'challenge_1', name: 'Challenge Starter', description: 'Complete your very first eco challenge.',
    criteria: (stats) => stats.challengesCompleted >= 1,
    icon: Trophy, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'points_50', name: 'Point Novice', description: 'Earn 50 points from challenges.',
    criteria: (stats) => stats.totalPoints >= 50,
    icon: Sparkles, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'water_50l', name: 'Water Sipper (Weekly)', description: 'Save 50 Liters of water this week.',
    criteria: (stats) => stats.waterSavedThisMonthLiters >= 50,
    icon: Droplets, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'money_5aed', name: 'Coin Saver (Weekly)', description: 'Save 5 AED this week.',
    criteria: (stats) => stats.moneySavedThisMonth >= 5, 
    icon: DollarSign, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'streak_3day', name: 'Steady Hand (3 Day Streak)', description: 'Maintain a 3-day activity streak (placeholder stat).',
    criteria: (stats) => stats.currentStreakDays >= 3,
    icon: TrendingUp, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'easy_3', name: 'Easy Wins', description: 'Complete 3 "Easy" difficulty challenges.',
    criteria: (stats) => stats.easyChallengesCompleted >= 3,
    icon: Award, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'challenge_5', name: 'Challenge Explorer', description: 'Complete 5 eco challenges.',
    criteria: (stats) => stats.challengesCompleted >= 5,
    icon: Trophy, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'points_250', name: 'Point Collector', description: 'Earn 250 points from challenges.',
    criteria: (stats) => stats.totalPoints >= 250,
    icon: Sparkles, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'water_200l', name: 'Water Conserver (Weekly)', description: 'Save 200 Liters of water this week.',
    criteria: (stats) => stats.waterSavedThisMonthLiters >= 200, 
    icon: Droplets, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'money_20aed', name: 'Budget Conscious (Weekly)', description: 'Save 20 AED this week.',
    criteria: (stats) => stats.moneySavedThisMonth >= 20, 
    icon: DollarSign, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'streak_7day', name: 'Weekly Champion (7 Day Streak)', description: 'Maintain a 7-day activity streak (placeholder stat).',
    criteria: (stats) => stats.currentStreakDays >= 7,
    icon: TrendingUp, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'medium_3', name: 'Medium Miler', description: 'Complete 3 "Medium" difficulty challenges.',
    criteria: (stats) => stats.mediumChallengesCompleted >= 3,
    icon: Target, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'ai_1', name: 'AI Enthusiast', description: 'Complete 1 challenge suggested by the AI.',
    criteria: (stats) => stats.aiChallengesCompleted >= 1,
    icon: Lightbulb, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'challenge_10', name: 'Challenge Veteran', description: 'Complete 10 eco challenges.',
    criteria: (stats) => stats.challengesCompleted >= 10,
    icon: Trophy, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'points_750', name: 'Point Tycoon', description: 'Earn 750 points from challenges.',
    criteria: (stats) => stats.totalPoints >= 750,
    icon: Sparkles, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'water_500l', name: 'Water Hero (Weekly)', description: 'Save 500 Liters of water this week.',
    criteria: (stats) => stats.waterSavedThisMonthLiters >= 500, 
    icon: Droplets, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'money_50aed', name: 'Thrifty Guardian (Weekly)', description: 'Save 50 AED this week.',
    criteria: (stats) => stats.moneySavedThisMonth >= 50, 
    icon: DollarSign, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'hard_1', name: 'Hard Hitter', description: 'Complete 1 "Hard" difficulty challenge.',
    criteria: (stats) => stats.hardChallengesCompleted >= 1,
    icon: Star, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
  {
    id: 'ai_3', name: 'AI Whisperer', description: 'Complete 3 challenges suggested by the AI.',
    criteria: (stats) => stats.aiChallengesCompleted >= 3,
    icon: Lightbulb, achievedClasses: regularAchievedClasses,
    unachievedClasses: unachievedClasses,
  },
];

const superAchieverBadge: AchievementBadgeDefinition = {
  id: 'super_achiever',
  name: 'Aqua Luminary', 
  description: "You've mastered the art of water conservation and completed all other challenges!", 
  criteria: (stats) => regularBadges.every(badge => badge.criteria(stats)),
  icon: Sun, 
  achievedClasses: superAchievedClasses,
  unachievedClasses: unachievedClasses,
  isSecret: true,
  secretName: 'Secret Achievement',
  secretDescription: '🤫 Complete all other achievements to unlock!',
  secretIcon: HelpCircle,
};

export const allAchievementBadges: AchievementBadgeDefinition[] = [...regularBadges, superAchieverBadge];


export interface WaterUsageFact {
  id: string;
  title: string;
  description: string;
  iconName: ChallengeIconName; // Re-use ChallengeIconName for simplicity
}

export const waterUsageFacts: WaterUsageFact[] = [
  {
    id: "fact1",
    title: "Leaky Faucet",
    description: "A faucet dripping at just one drip per second can waste over 11,000 liters (approx. 3,000 gallons) of water per year! That's enough water for more than 180 showers.",
    iconName: "Pipette",
  },
  {
    id: "fact2",
    title: "Typical Shower",
    description: "An average shower uses about 6-10 liters (1.5-2.5 gallons) of water per minute. A 10-minute shower can easily consume 60-100 liters (15-25 gallons).",
    iconName: "ShowerHead",
  },
  {
    id: "fact3",
    title: "Toilet Flush",
    description: "Older toilets can use as much as 13-26 liters (3.5-7 gallons) per flush. Modern, water-efficient toilets use 6 liters (1.6 gallons) or less.",
    iconName: "Droplet", 
  },
  {
    id: "fact4",
    title: "Running Tap (Brushing Teeth)",
    description: "Leaving the tap running while you brush your teeth for two minutes can waste up to 15 liters (4 gallons) of water. Simply turning it off saves a lot!",
    iconName: "Pipette",
  },
  {
    id: "fact5",
    title: "Washing Machine",
    description: "A typical top-loading washing machine can use 75-100 liters (20-25 gallons) per load. High-efficiency front-loaders use significantly less, around 50 liters (13 gallons).",
    iconName: "WashingMachine",
  },
  {
    id: "fact6",
    title: "Dishwasher Cycle",
    description: "A standard dishwasher uses about 20-25 liters (5-6.5 gallons) of water per cycle. Energy Star certified models can use as little as 10-15 liters (2.5-4 gallons).",
    iconName: "CookingPot", 
  },
  {
    id: "fact7",
    title: "Garden Watering (Sprinkler)",
    description: "Watering a typical lawn with a sprinkler for just one hour can use over 1,000 liters (more than 260 gallons) of water. Consider drought-resistant plants or drip irrigation.",
    iconName: "TreePine",
  },
  {
    id: "fact8",
    title: "Hand Washing Dishes",
    description: "Washing dishes by hand with the tap running can use up to 75 liters (20 gallons) of water. Using a basin or two-sink method is much more efficient.",
    iconName: "ChefHat",
  },
  {
    id: "fact9",
    title: "Car Wash (Hose)",
    description: "Washing a car with a running hose can use 300-500 liters (80-140 gallons) of water. Using a bucket and sponge or a commercial car wash that recycles water is better.",
    iconName: "Car",
  },
];
