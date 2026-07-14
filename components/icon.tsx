import {
  Globe,
  Rocket,
  User,
  AppWindow,
  PenTool,
  RefreshCw,
  Search,
  Sparkles,
  Gauge,
  MessageSquare,
  Layers,
  Smartphone,
  ShieldCheck,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/lib/content';

const map: Record<IconName, LucideIcon> = {
  globe: Globe,
  rocket: Rocket,
  user: User,
  appWindow: AppWindow,
  penTool: PenTool,
  refresh: RefreshCw,
  search: Search,
  sparkles: Sparkles,
  gauge: Gauge,
  messageSquare: MessageSquare,
  layers: Layers,
  smartphone: Smartphone,
  shieldCheck: ShieldCheck,
  clock: Clock,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = map[name];
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
