import { Icon } from "@chakra-ui/react";
import type { IconProps } from "@chakra-ui/react";

export const CoinIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" fill="gold" />
    <circle cx="12" cy="12" r="8" fill="goldenrod" />
    <text
      x="12"
      y="16"
      fontSize="12"
      textAnchor="middle"
      fill="gold"
      style={{ fontWeight: 'bold' }}
    >
      $
    </text>
  </Icon>
);

export const GemIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="purple"
      d="M12 2L2 8l10 6 10-6-10-6zM2 16l10 6 10-6-10-6-10 6z"
    />
  </Icon>
);

export const LockIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12 1C8.676 1 6 3.676 6 7v3H4v12h16V10h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v3H8V7c0-2.276 1.724-4 4-4z"
    />
  </Icon>
); 