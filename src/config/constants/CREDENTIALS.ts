/**
 * Credentials Data
 * Dive center credentials and certifications
 */

import { AcademicCapIcon, ShieldCheckIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import type { ForwardRefExoticComponent, SVGProps } from 'react';

export interface Credential {
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export const CREDENTIALS: Credential[] = [
  {
    icon: AcademicCapIcon,
    title: 'PADI 5 Star ECO Centre',
    description: 'Green Fins member with Green Star rating. Committed to conservation and sustainable diving practices.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Reef-World Federation Partner',
    description: 'Promoting best environmental practices and marine conservation in Northern Mauritius.',
  },
  {
    icon: UserGroupIcon,
    title: 'Patient Skilled Instructors',
    description: 'Focused on safety, knowing our fish and loving our world. Comprehensive facilities and personal service.',
  },
  {
    icon: TrophyIcon,
    title: '65 Dive Sites',
    description: 'Access to the best dive sites around Northern Mauritius Islands. Wreck, turtle, shark diving and exquisite coral reefs.',
  },
] as const;
